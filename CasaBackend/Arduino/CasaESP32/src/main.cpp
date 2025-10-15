#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ArxContainer.h>
#include <WebServer.h>
#include <WiFiUdp.h>

struct SimTime {
  int hour;
  int minute;
  int day; // 0=Dom, 6=Sab
  unsigned long lastUpdate;
};

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
};

// --- Listas de dispositivos y automatizaciones ---
arx::stdx::vector<Device, 12> devices;
arx::stdx::vector<Automation, 20> automations;

// --- MQTT ---
const char* mqttServer = "test.mosquitto.org";
const int mqttPort = 1883;

// --- TIEMPO ---
SimTime simTime = {8, 0, 0, 0};

WiFiClient espClient;
PubSubClient client(espClient);

// --- Servidor HTTP ---
WebServer server(80);

// ======================================================================
// ========================== FUNCIONES BASE ============================
// ======================================================================

void updateSimTime() {
  unsigned long now = millis();
  if (now - simTime.lastUpdate >= 1000) { // cada 1 segundo = 1 minuto simulado
    simTime.lastUpdate = now;
    simTime.minute++;
    if (simTime.minute >= 60) {
      simTime.minute = 0;
      simTime.hour++;
      if (simTime.hour >= 24) {
        simTime.hour = 0;
        simTime.day = (simTime.day + 1) % 7;
      }
    }
  }
}

void publishDevice(int devId, const Device& device) {
  StaticJsonDocument<256> doc;
  JsonObject obj = doc.createNestedObject("Data");
  obj["Id"] = devId;
  obj["State"] = device.state;

  switch (device.type) {
    case DEVICE_LED:
      obj["Type"] = "Led";
      obj["Brightness"] = device.props.led.brightness;
      break;
    case DEVICE_FAN:
      obj["Type"] = "Fan";
      obj["Speed"] = device.props.fan.speed;
      break;
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
    analogWrite(device.pin, device.state);
    Serial.printf("💡 Device %d -> state=%d\n", id, state);
    publishDevice(id, device);
    return;
  }

  if (strcmp(type, "Led") == 0) {
    device.props.led.brightness = brightness;
    analogWrite(device.pin, device.state ? brightness : 0);
    Serial.printf("💡 LED %d -> state=%d, brightness=%d\n", id, state, brightness);
  } else if (strcmp(type, "Fan") == 0) {
    device.props.fan.speed = speed;
    int pwm = map(speed, 0, 3, 0, 255);
    analogWrite(device.pin, device.state ? pwm : 0);
    Serial.printf("🌀 FAN %d -> state=%d, speed=%d\n", id, state, speed);
  }

  publishDevice(id, device);
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
  int hour = simTime.hour;
  int minute = simTime.minute;
  int day = simTime.day; // 0=Dom ... 6=Sab

  int now = hour * 60 + minute;

  for (auto& a : automations) {
    if (!isDayActive(a.days, day)) continue;

    int start = a.startHour * 60 + a.startMinute;
    int end = a.endHour * 60 + a.endMinute;

    bool shouldBeOn = (now >= start && now < end);

    for (auto ad : a.devices) {
      if (shouldBeOn) {
        applyDeviceChange(ad.Id, ad.State, "", -1, -1);
      } else {
        applyDeviceChange(ad.Id, !ad.State, "", -1, -1);
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

// ======================================================================
// ========================= HTTP HANDLERS ==============================
// ======================================================================

void handlePutDevice() {
  if (!server.hasArg("plain")) {
    server.send(400, "application/json", "{\"error\":\"no body\"}");
    return;
  }

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, server.arg("plain"));
  if (error) {
    server.send(400, "application/json", "{\"error\":\"invalid JSON\"}");
    return;
  }

  int id = doc["Id"];
  bool state = doc["State"];
  const char* type = doc["Type"] | "";
  int brightness = doc["Brightness"] | -1;
  int speed = doc["Speed"] | -1;

  applyDeviceChange(id, state, type, brightness, speed);
  server.send(200, "application/json", "{\"status\":\"true\"}");
}

// 🔹 Nuevo endpoint: /automation
void handlePutAutomation() {
  if (!server.hasArg("plain")) {
    server.send(400, "application/json", "{\"error\":\"no body\"}");
    return;
  }

  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, server.arg("plain"));
  if (error) {
    server.send(400, "application/json", "{\"error\":\"invalid JSON\"}");
    return;
  }

  Automation a;
  a.startHour = doc["StartHour"];
  a.startMinute = doc["StartMinute"];
  a.endHour = doc["EndHour"];
  a.endMinute = doc["EndMinute"];
  a.days = doc["Days"];
  a.state = doc["State"];
  for (JsonVariant ad : doc["Devices"].as<JsonArray>()) {
    AutomationDevice dev;
    dev.Id = ad["Id"];
    dev.State = ad["State"];
    a.devices.push_back(dev);
  }

  automations.push_back(a);
  publishAutomation(a, automations.size());
  server.send(200, "application/json", "{\"status\":\"automation added\"}");
}

void handleAlive() {
  server.send(200, "text/plain", "OK");
}

void handleNotFound() {
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

  if (strcmp(topic, "casa/devices/cmd") == 0) {
    int id = doc["Id"];
    bool state = doc["State"];
    const char* type = doc["Type"] | "";
    int brightness = doc["Brightness"] | -1;
    int speed = doc["Speed"] | -1;
    applyDeviceChange(id, state, type, brightness, speed);
  } 
  else if (strcmp(topic, "casa/automations/cmd") == 0) {
    Automation a;
    a.startHour = doc["StartHour"];
    a.startMinute = doc["StartMinute"];
    a.endHour = doc["EndHour"];
    a.endMinute = doc["EndMinute"];
    a.days = doc["Days"];
    a.state = doc["State"];
    for (JsonVariant ad : doc["Devices"].as<JsonArray>()) {
      AutomationDevice dev;
      dev.Id = ad["Id"];
      dev.State = ad["State"];
      a.devices.push_back(dev);
    }

    automations.push_back(a);
    publishAutomation(a, automations.size());
    Serial.println("📥 Nueva automatización agregada vía MQTT");
  }
}

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    if (client.connect("ESP32Client-LocalAPI")) {
      Serial.println("✅ Conectado!");
      client.subscribe("casa/devices/cmd");
      client.subscribe("casa/automations/cmd");
    } else {
      Serial.print("Error: ");
      Serial.println(client.state());
      delay(2000);
    }
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

  selectAndConnectWiFi();

  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  reconnectMQTT();

  server.on("/device", HTTP_PUT, handlePutDevice);
  server.on("/automation", HTTP_PUT, handlePutAutomation);
  server.on("/", handleAlive);
  server.onNotFound(handleNotFound);
  server.begin();
  Serial.println("🌐 Servidor HTTP iniciado en puerto 80");

  // Crear dispositivos
  Device led1 = {2, true, DEVICE_LED, {.led = {128}}};
  Device fan1 = {4, false, DEVICE_FAN, {.fan = {2}}};
  devices.push_back(led1);
  devices.push_back(fan1);

  // Publicar estado inicial
  for (int i = 0; i < devices.size(); i++)
    publishDevice(i + 1, devices[i]);
  // Crear automation
  Automation auto1;
  auto1.startHour = 8;
  auto1.startMinute = 0;
  auto1.endHour = 18;
  auto1.endMinute = 0;
  auto1.days = 127;
  auto1.state = true;

  AutomationDevice dev1 = {1, true};
  AutomationDevice dev2 = {2, true};
  auto1.devices.push_back(dev1);
  auto1.devices.push_back(dev2);
  automations.push_back(auto1);
  publishAutomation(auto1, automations.size());
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ WiFi desconectado, intentando reconectar...");
    selectAndConnectWiFi();
  }
  if (!client.connected()) reconnectMQTT();

  client.loop();
  server.handleClient();
  updateSimTime();

  static unsigned long lastAutoCheck = 0;
  if (millis() - lastAutoCheck > 60000) {
    checkAutomations();
    lastAutoCheck = millis();
  }

  delay(50);
}
