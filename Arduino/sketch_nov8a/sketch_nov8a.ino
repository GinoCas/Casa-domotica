#include <SoftwareSerial.h>
#include <ArxContainer.h>
#include <ArduinoJson.h>

SoftwareSerial btSerial(10,11);

struct Device {
  int pin;
  int mode;
  bool state;
};

void handleLed(Device& device, String& prop) {
  if(!device.state){
    analogWrite(device.pin, 0);
    return;
  }
  int brightness = prop.toInt();
  analogWrite(device.pin, brightness * 2);
}

void handleFan(Device& device, String& prop) {
  int speed = prop.toInt();
  analogWrite(device.pin, speed);
}

void setup() {
  Serial.begin(38400);
  btSerial.begin(38400);
}

void loop() {
  if(btSerial.available()){
    String command = btSerial.readStringUntil('\n');
    parseData(command);
  }
  if (Serial.available()) {
    btSerial.write(Serial.read());
  }
}

void parseData(String jsonCommand) {
  jsonCommand = jsonCommand.substring(1, jsonCommand.length() - 1);
  String elements[4];
  int startIndex = 0, commaIndex;
  for (int i = 0; i < 4; i++) {
    commaIndex = jsonCommand.indexOf(",", startIndex);
    if (commaIndex == -1) commaIndex = jsonCommand.length();

    elements[i] = jsonCommand.substring(startIndex, commaIndex);
    startIndex = commaIndex + 1;
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
  pinMode(device.pin, device.mode);
  String type = elements[0];
  if(type == "Led"){
    handleLed(device, elements[3]);
  }else{
    btSerial.println("unhandled type");
  }
}