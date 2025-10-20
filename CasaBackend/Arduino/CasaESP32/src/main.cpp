#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ArxContainer.h>
#include <WebServer.h>
#include <WiFiUdp.h>
#include <time.h>

struct tm simTime = { 0 };
unsigned long lastSimTimeUpdate = 0;

enum DeviceType {
  DEVICE_LED,
  DEVICE_FAN
};

struct Led {
  int brightness; // 0-255
};

struct Fan {
  int speed;      // 0-3
};

struct Device {
  int pin;
  bool state;
  DeviceType type;
  union {
    Led led;
    Fan fan;
  } props;
};

struct AutomationDevice {
  int Id;
  bool State;
};

struct Automation {
  int startHour;
  int startMinute;
  int endHour;
  int endMinute;
  byte days;  // bitmask: Dom=1, Lun=2, Mar=4, Mie=8, Jue=16, Vie=32, Sab=64
  bool state; // encender o apagar
  arx::stdx::vector<AutomationDevice, 12> devices; // IDs de dispositivos afectados
  time_t lastTriggered;
  bool isCurrentlyActive;
};

// --- Listas de dispositivos y automatizaciones ---
arx::stdx::vector<Device, 12> devices;
arx::stdx::vector<Automation, 20> automations;

bool saveEnergyMode = false;
bool activityMode = false;
// --- Snapshot para modo SaveEnergy ---
int ledPreSaveBrightness[12];
// --- Snapshot para modo Activity ---
bool activitySnapshotValid = false;
bool activityPreState[12];
int activityPreLedBrightness[12];
int activityPreFanSpeed[12];
// --- Estado del modo Activity ---
unsigned long activityNextEventAt = 0;
int activityCurrentDevice = -1;

// --- MQTT ---
const char* mqttServer = "test.mosquitto.org";
const int mqttPort = 1883;

// --- TIEMPO ---

WiFiClient espClient;
PubSubClient client(espClient);

// --- Servidor HTTP ---
WebServer server(80);

// ======================================================================
// ========================== FUNCIONES BASE ============================
// ======================================================================

void updateSimTime() {
  unsigned long now = millis();
  if (now - lastSimTimeUpdate >= 1000) { // 1 segundo real = 1 minuto simulado
    lastSimTimeUpdate = now;
    simTime.tm_min++;
    mktime(&simTime); // Normaliza la estructura tm (maneja desbordes)
    //Serial.printf("🕒 Hora simulada: %02d:%02d | Día: %d\n", simTime.tm_hour, simTime.tm_min, simTime.tm_wday);
  }
}

void publishDevices(const arx::stdx::vector<Device, 12>& devicesToPublish) {
  StaticJsonDocument<1024> doc;
  JsonArray arr = doc.createNestedArray("Data");
  for (size_t i = 0; i < devicesToPublish.size(); i++) {
    const Device &d = devices[i];
    JsonObject obj = arr.createNestedObject();
    obj["Id"] = i + 1;
    obj["State"] = d.state;
    switch (d.type) {
      case DEVICE_LED:
        obj["Type"] = "Led";
        obj["Brightness"] = d.props.led.brightness;
        break;
      case DEVICE_FAN:
        obj["Type"] = "Fan";
        obj["Speed"] = d.props.fan.speed;
        break;
      default:
        obj["Type"] = "";
        break;
    }
  }
  String json;
  serializeJson(doc, json);
  client.publish("casa/devices", json.c_str());
  Serial.println("Publicado cambio MQTT: " + json);
}

void applyDeviceChange(int id, bool state, const char* type, int brightness, int speed) {
  if (id <= 0 || id > devices.size()) return;
  Device& device = devices[id - 1];
  device.state = state;

  if (strcmp(type, "") == 0) {
    digitalWrite(device.pin, device.state ? HIGH : LOW);
    Serial.printf("\xF0\x9F\x92\xA1 Device %d -> state=%d\n", id, state);
    publishDevices({device});
    return;
  }

  if (strcmp(type, "Led") == 0) {
    device.props.led.brightness = brightness;
    int outBrightness = device.state ? (saveEnergyMode ? min(brightness, 128) : brightness) : 0;
    if (saveEnergyMode) {
      ledPreSaveBrightness[id - 1] = brightness;
    }
    analogWrite(device.pin, outBrightness);
    Serial.printf("\xF0\x9F\x92\xA1 LED %d -> state=%d, brightness=%d (out=%d)\n", id, state, brightness, outBrightness);
  } else if (strcmp(type, "Fan") == 0) {
    device.props.fan.speed = speed;
    int pwm = map(speed, 0, 3, 0, 255);
    analogWrite(device.pin, device.state ? pwm : 0);
    Serial.printf("\xF0\x9F\xAA\x80 FAN %d -> state=%d, speed=%d\n", id, state, speed);
  }

  publishDevices({device});
}

// ======================================================================
// =========================== AUTOMATIONS ==============================
// ======================================================================

bool isDayActive(byte bitmask, int weekday) {
  // weekday: 0=Dom ... 6=Sab
  return bitmask & (1 << weekday);
}

void checkAutomations() {
  updateSimTime();
  if (activityMode) return;
  time_t now = mktime(&simTime);

  for (auto& a : automations) {
    if (!isDayActive(a.days, simTime.tm_wday)) continue;

    int start = a.startHour * 60 + a.startMinute;
    int end = a.endHour * 60 + a.endMinute;
    int currentTime = simTime.tm_hour * 60 + simTime.tm_min;

    bool shouldBeActive = (currentTime >= start && currentTime < end);

    if (shouldBeActive && !a.isCurrentlyActive) {
      a.isCurrentlyActive = true;
      a.lastTriggered = now;
      Serial.printf("⚙️ Activando automatización | %02d:%02d - %02d:%02d\n", a.startHour, a.startMinute, a.endHour, a.endMinute);
      for (auto ad : a.devices) {
        applyDeviceChange(ad.Id, a.state, "", -1, -1);
      }
    } else if (!shouldBeActive && a.isCurrentlyActive) {
      a.isCurrentlyActive = false;
      Serial.printf("⚙️ Desactivando automatización | %02d:%02d - %02d:%02d\n", a.startHour, a.startMinute, a.endHour, a.endMinute);
      for (auto ad : a.devices) {
        applyDeviceChange(ad.Id, !a.state, "", -1, -1);
      }
    }
  }
}

void publishAutomation(const Automation& a, int index) {
  StaticJsonDocument<256> doc;
  JsonObject obj = doc.createNestedObject("Data");
  obj["Id"] = index;
  obj["StartHour"] = a.startHour;
  obj["StartMinute"] = a.startMinute;
  obj["EndHour"] = a.endHour;
  obj["EndMinute"] = a.endMinute;
  obj["Days"] = a.days;
  obj["State"] = a.state;

  JsonArray devs = obj.createNestedArray("Devices");
  for (auto ad : a.devices) {
    JsonObject d = devs.createNestedObject();
    d["Id"] = ad.Id;
    d["State"] = ad.State;
  }

  String json;
  serializeJson(doc, json);
  client.publish("casa/automations", json.c_str());
  Serial.println("📡 Publicada automatización: " + json);
}

String publishAutomationErase(int id) {
  StaticJsonDocument<128> doc;
  JsonObject obj = doc.createNestedObject("Data");
  obj["Id"] = id;
  String output;
  serializeJson(doc, output);
  client.publish("casa/automations/erase", output.c_str());
  Serial.println("📡 Publicada eliminación de automatización: " + output);
  return output;
}

String publishMode(const String & name, bool state) {
  StaticJsonDocument<128> doc;
  JsonObject obj = doc.createNestedObject("Data");
  obj["Name"] = name;
  obj["State"] = state;
  String output;
  serializeJson(doc, output);
  client.publish("casa/modes", output.c_str());
  Serial.println("📡 Publicado modo: " + output);
  return output;
}

void onSaveEnergyModeChanged(bool enabled) {
  for (int i = 0; i < devices.size(); i++) {
    Device &d = devices[i];
    if (d.type == DEVICE_LED) {
      if (enabled) {
        if (ledPreSaveBrightness[i] == -1) {
          ledPreSaveBrightness[i] = d.props.led.brightness;
        }
        int outB = d.props.led.brightness > 128 ? 128 : d.props.led.brightness;
        analogWrite(d.pin, d.state ? outB : 0);
      } else {
        if (ledPreSaveBrightness[i] != -1) {
          analogWrite(d.pin, d.state ? ledPreSaveBrightness[i] : 0);
          d.props.led.brightness = ledPreSaveBrightness[i];
          ledPreSaveBrightness[i] = -1;
        }
      }
    }
  }
}

void scheduleNextActivityEvent() {
  activityNextEventAt = millis() + (unsigned long)random(8000, 20000);
}

void onActivityModeChanged(bool enabled) {
  activityCurrentDevice = -1;
  if (enabled) {
    // Tomar snapshot de estados/parametros actuales
    activitySnapshotValid = true;
    for (int i = 0; i < devices.size(); i++) {
      Device &d = devices[i];
      activityPreState[i] = d.state;
      if (d.type == DEVICE_LED) {
        activityPreLedBrightness[i] = d.props.led.brightness;
      } else if (d.type == DEVICE_FAN) {
        activityPreFanSpeed[i] = d.props.fan.speed;
      }
      // Apagar dispositivos al entrar en modo actividad y publicar
      if (d.state) {
        d.state = false;
        analogWrite(d.pin, 0);
      }
      publishDevices({d});
    }
    scheduleNextActivityEvent();
  } else {
    // Restaurar estados/parametros previos al salir del modo actividad
    if (activitySnapshotValid) {
      for (int i = 0; i < devices.size(); i++) {
        Device &d = devices[i];
        bool prevState = activityPreState[i];
        if (d.type == DEVICE_LED) {
          int prevB = activityPreLedBrightness[i] >= 0 ? activityPreLedBrightness[i] : d.props.led.brightness;
          applyDeviceChange(i + 1, prevState, "Led", prevB, -1);
        } else if (d.type == DEVICE_FAN) {
          int prevS = activityPreFanSpeed[i] >= 0 ? activityPreFanSpeed[i] : d.props.fan.speed;
          applyDeviceChange(i + 1, prevState, "Fan", -1, prevS);
        } else {
          applyDeviceChange(i + 1, prevState, "", -1, -1);
        }
        // Limpiar snapshot
        activityPreState[i] = false;
        activityPreLedBrightness[i] = -1;
        activityPreFanSpeed[i] = -1;
      }
    }
    activitySnapshotValid = false;
  }
}

void handleActivityModeLoop() {
  if (!activityMode) return;
  unsigned long now = millis();
  if (now >= activityNextEventAt) {
    // Apagar el dispositivo anterior si estaba encendido y publicar el cambio
    if (activityCurrentDevice >= 0 && activityCurrentDevice < devices.size()) {
      Device &prev = devices[activityCurrentDevice];
      if (prev.state) {
        prev.state = false;
        analogWrite(prev.pin, 0);
        publishDevices({prev});
      }
    }

    if (devices.size() > 0) {
      int idx = random(0, devices.size());
      if (devices.size() > 1 && idx == activityCurrentDevice) {
        idx = (idx + 1) % devices.size();
      }
      Device &d = devices[idx];
      activityCurrentDevice = idx;

      if (d.type == DEVICE_LED) {
        int targetBrightness = d.props.led.brightness;
        if (saveEnergyMode) {
          // Guardar el brillo deseado para restaurar al salir del modo ahorro
          ledPreSaveBrightness[idx] = targetBrightness;
          int outBr = targetBrightness > 128 ? 128 : targetBrightness;
          d.state = true;
          analogWrite(d.pin, outBr);
        } else {
          d.state = true;
          analogWrite(d.pin, targetBrightness);
        }
        publishDevices({d});
      } else if (d.type == DEVICE_FAN) {
        int pwm = map(d.props.fan.speed, 0, 3, 0, 255);
        d.state = true;
        analogWrite(d.pin, pwm);
        publishDevices({d});
      } else {
        d.state = true;
        analogWrite(d.pin, 1);
        publishDevices({d});
      }
    }

    scheduleNextActivityEvent();
  }
}

// ======================================================================
// ========================= HTTP HANDLERS ==============================
// ======================================================================

void handlePutDevice() {
  unsigned long start = millis();
  if (!server.hasArg("plain")) {
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.send(400, "application/json", "{\"error\":\"no body\"}");
    return;
  } 

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, server.arg("plain"));
  if (error) {
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.send(400, "application/json", "{\"error\":\"invalid JSON\"}");
    return;
  }

  int id = doc["Id"];
  bool state = doc["State"];
  const char* type = doc["Type"] | "";
  int brightness = doc["Brightness"] | -1;
  int speed = doc["Speed"] | -1;

  applyDeviceChange(id, state, type, brightness, speed);
  unsigned long proc = millis() - start;
  server.sendHeader("Connection", "keep-alive");
  server.sendHeader("Keep-Alive", "timeout=5, max=50");
  server.sendHeader("X-Proc-Time", String(proc));
  server.send(200, "application/json", "{\"status\":\"true\"}");
}

// 🔹 Nuevo endpoint: /automation
void handlePutAutomation() {
  unsigned long start = millis();
  if (!server.hasArg("plain")) {
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.send(400, "application/json", "{\"error\":\"no body\"}");
    return;
  }

  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, server.arg("plain"));
  if (error) {
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.send(400, "application/json", "{\"error\":\"invalid JSON\"}");
    return;
  }

  int automationId = doc["Id"] | -1;

  Automation a;
  a.startHour = doc["StartHour"];
  a.startMinute = doc["StartMinute"];
  a.endHour = doc["EndHour"];
  a.endMinute = doc["EndMinute"];
  a.days = doc["Days"];
  a.state = doc["State"];
  a.lastTriggered = 0;
  a.isCurrentlyActive = false;
  
  for (JsonVariant ad : doc["Devices"].as<JsonArray>()) {
    AutomationDevice dev;
    dev.Id = ad["Id"];
    dev.State = ad["State"];
    a.devices.push_back(dev);
  }

  if (automationId == -1) {
    automations.push_back(a);
    publishAutomation(a, automations.size());
    unsigned long proc = millis() - start;
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.sendHeader("X-Proc-Time", String(proc));
    server.send(200, "application/json", "{\"status\":\"automation added\"}");
  } else {
    int index = automationId - 1;
    if (index >= 0 && index < automations.size()) {
      automations[index] = a;
      publishAutomation(automations[index], automationId);
      unsigned long proc = millis() - start;
      server.sendHeader("Connection", "keep-alive");
      server.sendHeader("Keep-Alive", "timeout=5, max=50");
      server.sendHeader("X-Proc-Time", String(proc));
      server.send(200, "application/json", "{\"status\":\"automation updated\"}");
    } else {
      server.sendHeader("Connection", "keep-alive");
      server.sendHeader("Keep-Alive", "timeout=5, max=50");
      server.send(404, "application/json", "{\"error\":\"automation not found\"}");
    }
  }
}

// NUEVO endpoint: /time para sincronizar la hora simulada
void handlePutTime() {
  unsigned long start = millis();
  if (!server.hasArg("plain")) {
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.send(400, "application/json", "{\"error\":\"no body\"}");
    return;
  }

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, server.arg("plain"));
  if (error) {
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.send(400, "application/json", "{\"error\":\"invalid JSON\"}");
    return;
  }

  int hour = doc["Hour"] | -1;
  int minute = doc["Minute"] | -1;
  int second = doc["Second"] | 0;
  int weekDay = doc["WeekDay"] | -1; // 0=Domingo .. 6=Sabado

  if (hour < 0 || minute < 0 || weekDay < 0) {
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.send(400, "application/json", "{\"error\":\"missing fields\"}");
    return;
  }

  simTime.tm_hour = hour;
  simTime.tm_min = minute;
  simTime.tm_sec = second;

  int currentWday = simTime.tm_wday;
  int deltaDays = (weekDay - currentWday + 7) % 7;
  simTime.tm_mday += deltaDays;
  mktime(&simTime);
  lastSimTimeUpdate = millis();
  Serial.printf("\xF0\x9F\x95\x92 Sincronizado: %02d:%02d:%02d | Día: %d\n", simTime.tm_hour, simTime.tm_min, simTime.tm_sec, simTime.tm_wday);

  unsigned long proc = millis() - start;
  server.sendHeader("Connection", "keep-alive");
  server.sendHeader("Keep-Alive", "timeout=5, max=50");
  server.sendHeader("X-Proc-Time", String(proc));
  server.send(200, "application/json", "{\"data\":true}");
}

void handlePutMode() {
  unsigned long start = millis();
  if (!server.hasArg("plain")) { 
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.send(400, "text/plain", "Bad Request"); 
    return; 
  }
  StaticJsonDocument<256> doc;
  DeserializationError err = deserializeJson(doc, server.arg("plain"));
  if (err) { 
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.send(400, "text/plain", "Invalid JSON"); 
    return; 
  }
  const char* name = doc["Name"] | "";
  bool state = doc["State"];
  String nm = String(name);
  nm.toLowerCase();
  if (nm == "activity") {
    activityMode = state;
    onActivityModeChanged(activityMode);
    publishMode("Activity", activityMode);
    unsigned long proc = millis() - start;
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.sendHeader("X-Proc-Time", String(proc));
    server.send(200, "application/json", "{\"success\":true}");
    return;
  }
  if (nm == "save-energy" || nm == "saveenergy" || nm == "save_energy") {
    saveEnergyMode = state;
    onSaveEnergyModeChanged(saveEnergyMode);
    publishMode("SaveEnergy", saveEnergyMode);
    unsigned long proc = millis() - start;
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.sendHeader("X-Proc-Time", String(proc));
    server.send(200, "application/json", "{\"success\":true}");
    return;
  }
  server.sendHeader("Connection", "keep-alive");
  server.sendHeader("Keep-Alive", "timeout=5, max=50");
  server.send(404, "text/plain", "Mode Not Found");
}

void handleAlive() {
  unsigned long start = millis();
  unsigned long proc = millis() - start;
  server.sendHeader("Connection", "keep-alive");
  server.sendHeader("Keep-Alive", "timeout=5, max=50");
  server.sendHeader("X-Proc-Time", String(proc));
  server.send(200, "text/plain", "OK");
}

void handleDeleteAutomation() {
  unsigned long start = millis();
  String uri = server.uri();
  if (!uri.startsWith("/automation/")) {
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.send(404, "application/json", "{\"error\":\"invalid path\"}");
    return;
  }
  String idStr = uri.substring(String("/automation/").length());
  int automationId = idStr.toInt();
  int index = automationId - 1;
  if (index >= 0 && index < automations.size()) {
    automations.erase(automations.begin() + index);
    publishAutomationErase(automationId);
    unsigned long proc = millis() - start;
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.sendHeader("X-Proc-Time", String(proc));
    server.send(200, "application/json", "{\"data\":true}");
  } else {
    server.sendHeader("Connection", "keep-alive");
    server.sendHeader("Keep-Alive", "timeout=5, max=50");
    server.send(404, "application/json", "{\"error\":\"automation not found\"}");
  }
}

void handleNotFound() {
  if (server.method() == HTTP_DELETE && server.uri().startsWith("/automation/")) {
    handleDeleteAutomation();
    return;
  }
  server.send(404, "application/json", "{\"error\":\"not found\"}");
}

// ======================================================================
// ============================ MQTT ====================================
// ======================================================================

void callback(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  if (error) {
    Serial.println("❌ Error al parsear JSON MQTT");
    return;
  }
  Serial.println("COMANDO MQTT RECIBIDO.");

  if (strcmp(topic, "casa/devices/cmd") == 0) {
    JsonArray arr = doc.as<JsonArray>();
    if (!arr.isNull()) {
      for (JsonVariant item : arr) {
        int id = item["Id"] | -1;
        if (id == -1) continue;
        bool state = item["State"];
        const char* type = item["Type"] | "";
        int brightness = item["Brightness"] | -1;
        int speed = item["Speed"] | -1;
        applyDeviceChange(id, state, type, brightness, speed);
      }
    } else {
      int id = doc["Id"];
      bool state = doc["State"];
      const char* type = doc["Type"] | "";
      int brightness = doc["Brightness"] | -1;
      int speed = doc["Speed"] | -1;
      applyDeviceChange(id, state, type, brightness, speed);
    }
  } 
  else if (strcmp(topic, "casa/automations/cmd") == 0) {
    const char* cmd = doc["Cmd"] | "";
    if (strcmp(cmd, "erase") == 0 || strcmp(cmd, "delete") == 0) {
      int automationId = doc["Id"] | -1;
      int index = automationId - 1;
      if (index >= 0 && index < automations.size()) {
        automations.erase(automations.begin() + index);
        publishAutomationErase(automationId);
        Serial.println("📥 Automatización eliminada vía MQTT");
      } else {
        Serial.println("❌ Error: ID de automatización no encontrado para eliminar vía MQTT");
      }
    } else {
      int automationId = doc["Id"] | -1;

      Automation a;
      a.startHour = doc["StartHour"];
      a.startMinute = doc["StartMinute"];
      a.endHour = doc["EndHour"];
      a.endMinute = doc["EndMinute"];
      a.days = doc["Days"];
      a.state = doc["State"];
      a.lastTriggered = 0;
      a.isCurrentlyActive = false;
      for (JsonVariant ad : doc["Devices"].as<JsonArray>()) {
        AutomationDevice dev;
        dev.Id = ad["Id"];
        dev.State = ad["State"];
        a.devices.push_back(dev);
      }

      if (automationId == -1) {
          automations.push_back(a);
          publishAutomation(a, automations.size());
          Serial.println("📥 Nueva automatización agregada vía MQTT");
      } else {
          int index = automationId - 1;
          if (index >= 0 && index < automations.size()) {
              automations[index] = a;
              publishAutomation(automations[index], automationId);
              Serial.println("📥 Automatización actualizada vía MQTT");
          } else {
              Serial.println("❌ Error: ID de automatización no encontrado para actualizar vía MQTT");
          }
      }
    }
  }
  else if (strcmp(topic, "casa/modes/cmd") == 0) {
    const char* name = doc["Name"] | "";
    bool state = doc["State"];
    String nm = String(name);
    nm.toLowerCase();
    if (nm == "activity") {
      activityMode = state;
      onActivityModeChanged(activityMode);
      publishMode("Activity", activityMode);
      Serial.println("📥 Modo de actividad actualizado vía MQTT");
    } else if (nm == "save-energy" || nm == "saveenergy" || nm == "save_energy") {
      saveEnergyMode = state;
      onSaveEnergyModeChanged(saveEnergyMode);
      publishMode("SaveEnergy", saveEnergyMode);
      Serial.println("📥 Modo de ahorro actualizado vía MQTT");
    } else {
      Serial.println("❌ Error: Modo inválido en MQTT");
    }
  }

}

void reconnectMQTT() {
  if (client.connected()) return;
  static unsigned long nextAttemptAt = 0;
  unsigned long now = millis();
  if (now < nextAttemptAt) return;
  Serial.print("Conectando a MQTT...");
  if (client.connect("ESP32Client-LocalAPI")) {
    Serial.println("✅ Conectado!");
    client.subscribe("casa/devices/cmd");
    client.subscribe("casa/automations/cmd");
    client.subscribe("casa/modes/cmd");
    nextAttemptAt = 0;
  } else {
    Serial.print("Error: ");
    Serial.println(client.state());
    nextAttemptAt = now + 2000; // volver a intentar en ~2s
  }
}

// ======================================================================
// ============================ WIFI ====================================
// ======================================================================

String readSerialLine() {
  String input = "";
  while (true) {
    if (Serial.available()) {
      char c = Serial.read();
      if (c == '\n' || c == '\r') {
        if (input.length() > 0) break;
      } else {
        input += c;
      }
    }
  }
  return input;
}

void selectAndConnectWiFi() {
  Serial.println("\n🔍 Escaneando redes WiFi...");
  int n = WiFi.scanNetworks();
  if (n == 0) {
    Serial.println("❌ No se encontraron redes.");
    return;
  }

  for (int i = 0; i < n; ++i)
    Serial.printf("%d: %s (%d dBm)\n", i + 1, WiFi.SSID(i).c_str(), WiFi.RSSI(i));

  Serial.println("\n👉 Ingresa el número de la red:");
  int choice = -1;
  while (choice < 1 || choice > n) {
    String input = readSerialLine();
    choice = input.toInt();
  }

  String ssid = WiFi.SSID(choice - 1);
  Serial.println("🔑 Ingresa la contraseña:");
  String password = readSerialLine();

  WiFi.begin(ssid.c_str(), password.c_str());
  Serial.printf("Conectando a '%s'...\n", ssid.c_str());
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Conectado!");
  Serial.print("IP local: ");
  Serial.println(WiFi.localIP());
}

// ======================================================================
// ============================ SETUP/LOOP ==============================
// ======================================================================

void setup() {
  Serial.begin(115200);
  delay(1000);
  WiFi.setSleep(false);
  WiFi.setAutoReconnect(true);
  // Inicializar arrays y random para modos
  for (int i = 0; i < 12; i++) {
    ledPreSaveBrightness[i] = -1;
    activityPreState[i] = false;
    activityPreLedBrightness[i] = -1;
    activityPreFanSpeed[i] = -1;
  }
  activitySnapshotValid = false;
  randomSeed(micros());

  // Inicializar la hora simulada
  simTime.tm_hour = 8;
  simTime.tm_min = 0;
  simTime.tm_sec = 0;
  simTime.tm_mday = 1; // Día del mes (no es crítico para la simulación)
  simTime.tm_mon = 0;  // Enero (no es crítico)
  simTime.tm_year = 2024 - 1900; // Años desde 1900
  mktime(&simTime); // Normaliza y calcula el día de la semana (tm_wday)

  selectAndConnectWiFi();

  client.setServer(mqttServer, mqttPort);
  espClient.setNoDelay(true);
  client.setCallback(callback);
  reconnectMQTT();

  server.on("/device", HTTP_PUT, handlePutDevice);
  server.on("/automation", HTTP_PUT, handlePutAutomation);
  server.on("/mode", HTTP_PUT, handlePutMode);
  server.on("/time", HTTP_PUT, handlePutTime);
  server.on("/", handleAlive);
  server.onNotFound(handleNotFound);
  server.begin();
  Serial.println("\xF0\x9F\x8C\x90 Servidor HTTP iniciado en puerto 80");

  // Crear dispositivos
  devices.push_back({2, true, DEVICE_LED, {.led = {255}}}); 
  devices.push_back({4, true, DEVICE_LED, {.fan = {2}}}); 
  devices.push_back({5, true, DEVICE_LED, {.led = {255}}}); 
  devices.push_back({15, true, DEVICE_LED, {.led = {255}}}); 
  devices.push_back({18, true, DEVICE_LED, {.led = {255}}}); 
  devices.push_back({19, true, DEVICE_LED, {.led = {255}}}); 
  devices.push_back({21, true, DEVICE_LED, {.led = {255}}}); 
  devices.push_back({23, true, DEVICE_LED, {.led = {255}}}); 
  devices.push_back({22, true, DEVICE_LED}); // TV
  // Publicar estado inicial
  for (int i = 0; i < devices.size(); i++) {
    pinMode(devices[i].pin, OUTPUT);
  }
  publishDevices(devices);
  Automation auto1;
  auto1.startHour = 8;
  auto1.startMinute = 0;
  auto1.endHour = 18;
  auto1.endMinute = 0;
  auto1.days = 127;
  auto1.state = true;
  auto1.lastTriggered = 0;
  auto1.isCurrentlyActive = false;

  AutomationDevice dev1 = {1, true};
  AutomationDevice dev2 = {2, true};
  auto1.devices.push_back(dev1);
  auto1.devices.push_back(dev2);
  automations.push_back(auto1);
  publishAutomation(auto1, automations.size());
}

void loop() {
  // Atender HTTP primero para máxima responsividad
  server.handleClient();
  // Mantener MQTT operativo
  client.loop();

  // Reconexión WiFi no bloqueante
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.reconnect();
  }
  // Reconexión MQTT no bloqueante
  reconnectMQTT();

  updateSimTime();

  static unsigned long lastAutoCheck = 0;
  if (millis() - lastAutoCheck > 1000) {
    checkAutomations();
    lastAutoCheck = millis();
  }

  // Modo actividad: prender dispositivos al azar con intervalos
  handleActivityModeLoop();

  // Evitar retrasos innecesarios, ceder CPU a WiFi
  delay(0);
}

