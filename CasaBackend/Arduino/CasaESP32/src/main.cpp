#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ArxContainer.h>
#include <WebServer.h>

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

// --- Listas de dispositivos y automatizaciones ---
arx::stdx::vector<Device, 12> devices;

// --- MQTT ---
const char* mqttServer = "test.mosquitto.org";  // o tu broker externo
const int mqttPort = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// --- Servidor HTTP ---
WebServer server(80);

// --- Funciones ---
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
  if(type == ""){
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

// --- Endpoint local PUT /device ---
void handlePutDevice() {
  if (server.hasArg("plain")) {
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, server.arg("plain"));
    if (error) {
      server.send(400, "application/json", "{\"error\":\"invalid JSON\"}");
      return;
    }
    Serial.println("Request Recibida");
    int id = doc["Id"];
    bool state = doc["State"];
    const char* type = doc["Type"] | "";
    int brightness = doc["Brightness"] | -1;
    int speed = doc["Speed"] | -1;

    applyDeviceChange(id, state, type, brightness, speed);
    server.send(200, "application/json", "{\"status\":\"true\"}");
  } else {
    server.send(400, "application/json", "{\"error\":\"no body\"}");
  }
}

void handleNotFound() {
  server.send(404, "application/json", "{\"error\":\"not found\"}");
}


void handleAlive() {
  server.send(200, "text/plain", "OK");
}

// --- MQTT ---
void callback(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  if (error) {
    Serial.println("❌ Error al parsear JSON MQTT");
    return;
  }

  JsonObject data = doc["Data"];
  int id = data["Id"];
  bool state = data["State"];
  const char* type = data["Type"] | "";
  int brightness = data["Brightness"] | -1;
  int speed = data["Speed"] | -1;

  applyDeviceChange(id, state, type, brightness, speed);
}

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    if (client.connect("ESP32Client-LocalAPI")) {
      Serial.println("✅ Conectado!");
      client.subscribe("casa/devices/cmd");
    } else {
      Serial.print("Error: ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

// --- WiFi ---
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

  for (int i = 0; i < n; ++i) {
    Serial.printf("%d: %s (%d dBm)\n", i + 1, WiFi.SSID(i).c_str(), WiFi.RSSI(i));
  }

  Serial.println("\n👉 Ingresa el número de la red:");
  int choice = -1;
  while (choice < 1 || choice > n) {
    String input = readSerialLine();
    choice = input.toInt();
  }

  String ssid = WiFi.SSID(choice - 1);
  String password = "";
  Serial.println("🔑 Ingresa la contraseña:");
  password = readSerialLine();

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

// --- Setup ---
void setup() {
  Serial.begin(115200);
  delay(1000);

  selectAndConnectWiFi();

  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  
  if (!client.connected()) {
    reconnectMQTT();
  }

  // --- Configurar servidor local ---
  server.on("/device", HTTP_PUT, handlePutDevice);
  server.on("/", handleAlive);
  server.onNotFound(handleNotFound);
  server.begin();
  Serial.println("🌐 Servidor HTTP iniciado en puerto 80");

  // --- Crear dispositivos ---
  Device led1 = {2, true, DEVICE_LED, {.led = {128}}};
  Device fan1 = {4, false, DEVICE_FAN, {.fan = {2}}};
  devices.push_back(led1);
  devices.push_back(fan1);

  // --- Publicar estados iniciales ---
  int devId = 0;
  for (const auto& device : devices) {
    devId++;
    publishDevice(devId, device);
  }
}

// --- Loop ---
void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ WiFi desconectado, intentando reconectar...");
    selectAndConnectWiFi();
  }

  if (!client.connected()) {
    reconnectMQTT();
  }

  client.loop();
  server.handleClient();
  delay(50);
}
