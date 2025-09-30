#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ArxContainer.h>

struct Device {
  int pin;
  bool state;
};

struct Automation {
  int initHour;
  int initMinute;
  int endHour;
  int endMinute;
  arx::stdx::map<int, bool, 12> devicesState;
};

arx::stdx::vector<Device, 12> devices;
arx::stdx::vector<Automation, 8> automations;


// 🔹 Configuración MQTT
const char* mqttServer = "test.mosquitto.org"; 
const int mqttPort = 1883;

// 🔹 Objetos WiFi/MQTT
WiFiClient espClient;
PubSubClient client(espClient);


void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    if (client.connect("ESP32Client-NASHEI12354")) {
      Serial.println("Conectado!");
    } else {
      Serial.print("Error: ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Conectando a ");
  Serial.println(ssid);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    int status = WiFi.status();
    Serial.print(" (status: ");
    Serial.print(status);
    Serial.print(")\n");
  }
  Serial.println("✅ Conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  client.setServer(mqttServer, mqttPort);
  devices.push_back({2, false});
  devices.push_back({3, true});
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  StaticJsonDocument<512> doc;
  JsonArray devicesArray = doc.createNestedArray("data");
  int devId = 0;
  for (const auto& device : devices) {
    devId++;
    JsonObject deviceObj = devicesArray.createNestedObject();
    deviceObj["Id"] = devId;
    deviceObj["State"] = device.state;
  }

  String json;
  serializeJson(doc, json);

  client.publish("casa/devices", json.c_str());
  Serial.println("Publicado: " + json);

  delay(5000);
}