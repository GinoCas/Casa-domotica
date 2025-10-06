#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ArxContainer.h>

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

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    if (client.connect("ESP32Client-NASHEI12354")) {
      Serial.println("✅ Conectado!");
    } else {
      Serial.print("Error: ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

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

  Serial.println("\n📶 Redes disponibles:");
  for (int i = 0; i < n; ++i) {
    Serial.printf("%d: %s  (Señal: %d dBm)  %s\n", 
                  i + 1, 
                  WiFi.SSID(i).c_str(),
                  WiFi.RSSI(i),
                  (WiFi.encryptionType(i) == WIFI_AUTH_OPEN) ? "🔓 abierta" : "🔒 con clave");
  }

  Serial.println("\n👉 Ingresa el número de la red a la que quieres conectarte:");
  int choice = -1;
  while (choice < 1 || choice > n) {
    String input = readSerialLine();
    choice = input.toInt();
  }

  String ssid = WiFi.SSID(choice - 1);
  bool requiresPassword = WiFi.encryptionType(choice - 1) != WIFI_AUTH_OPEN;
  String password = "";

  if (requiresPassword) {
    Serial.println("🔑 Ingresa la contraseña:");
    password = readSerialLine();
  }

  Serial.printf("Conectando a '%s'...\n", ssid.c_str());
  if (requiresPassword)
    WiFi.begin(ssid.c_str(), password.c_str());
  else
    WiFi.begin(ssid.c_str());

  unsigned long startAttempt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < 20000) {
    Serial.print(".");
    delay(500);
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Conexión exitosa!");
    Serial.print("IP asignada: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ No se pudo conectar a la red seleccionada.");
  }
}

void publishDevice(int devId, const Device& device) {
  StaticJsonDocument<256> doc;
  JsonObject obj = doc.createNestedObject("data");
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
  Serial.println("Publicado cambio: " + json);
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Seleccionar red WiFi e intentar conexión
  selectAndConnectWiFi();

  client.setServer(mqttServer, mqttPort);

  while(!client.connected()) {
    reconnectMQTT();
  })
  // Ejemplo de dispositivos
  Device led1;
  led1.pin = 2;
  led1.state = true;
  led1.type = DEVICE_LED;
  led1.props.led.brightness = 128;
  devices.push_back(led1);

  Device fan1;
  fan1.pin = 4;
  fan1.state = false;
  fan1.type = DEVICE_FAN;
  fan1.props.fan.speed = 2;
  devices.push_back(fan1);
  int devId = 0;
  for (const auto& device : devices) {
    devId++;
    publishDevice(devId, device);
  }
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ WiFi desconectado, intentando reconectar...");
    selectAndConnectWiFi();
  }

  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();
  int devId = 0;
  for (const auto& device : devices) {
    devId++;
    publishDevice(devId, device);
  }

  delay(5000);
}
