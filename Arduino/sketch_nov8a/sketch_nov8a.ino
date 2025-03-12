#include <SoftwareSerial.h>
#include <ArduinoJson.h>

SoftwareSerial btSerial(10, 11);

struct Device {
  int pin;
  int mode;
  bool state;
};

void handleLed(Device& device, String& prop) {
  if(!device.state) {
    analogWrite(device.pin, 0);
    return;
  }
  int brightness = prop.toInt();
  analogWrite(device.pin, brightness);
}

void handleFan(Device& device, String& prop) {
  int speed = prop.toInt();
  analogWrite(device.pin, speed);
}

void setup() {
  Serial.begin(38400);
  btSerial.begin(38400);
  Serial.println("Arduino listo para recibir comandos");
}

void loop() {
  if (btSerial.available()) {
    delay(10);
    String jsonCommand = "";
    while (btSerial.available()) {
      char c = btSerial.read();
      jsonCommand += c;
      if (c == ']') {
        break;
      }
    }
    Serial.println(jsonCommand);
    if (jsonCommand.startsWith("[") && jsonCommand.endsWith("]")) {
      Serial.println(jsonCommand);
      if (parseData(jsonCommand)) {
        btSerial.println("OK");
      } else {
        btSerial.println("ERROR");
      }
      delay(50);
    }
  }
  if (Serial.available()) {
    btSerial.write(Serial.read());
  }
}

bool parseData(String jsonCommand) {
  jsonCommand = jsonCommand.substring(1, jsonCommand.length() - 1);
  String elements[4];
  int startIndex = 0, commaIndex;
  for (int i = 0; i < 4; i++) {
    commaIndex = jsonCommand.indexOf(",", startIndex);
    if (commaIndex == -1) commaIndex = jsonCommand.length();
    
    elements[i] = jsonCommand.substring(startIndex, commaIndex);
    startIndex = commaIndex + 1;
    if (startIndex >= jsonCommand.length()) break;
  }
  for (int i = 0; i < 4; i++) {
    elements[i].trim();
    elements[i].replace("\"", "");
  }
  Device device = {
    elements[1].toInt(),
    OUTPUT,
    (elements[2] == "true"),
  };
  if (device.pin < 2 || device.pin > 13) {
    Serial.println("Pin inválido: " + String(device.pin));
    return false;
  }
  pinMode(device.pin, device.mode);
  String type = elements[0];
  if (type == "Led") {
    handleLed(device, elements[3]);
    return true;
  } else if (type == "Tv" || type == "Fan") {
    digitalWrite(device.pin, device.state ? HIGH : LOW);
    return true;
  } else {
    Serial.println("Tipo de dispositivo desconocido: " + type);
    return false;
  }
}