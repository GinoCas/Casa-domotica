#include <SoftwareSerial.h>
#include <ArxContainer.h>
#include <ArduinoJson.h>

SoftwareSerial btSerial(7,8);
StaticJsonDocument<200> content;

struct Device {
  int pin;
  int mode;
  bool state;
};

void handleLed(Device& device, JsonDocument& content) {
  if(!device.state){
    analogWrite(device.pin, 0);
    return;
  }
  int brightness = content["brightness"];
  analogWrite(device.pin, brightness / 4);
}

void handleFan(Device& device, JsonDocument& content) {
  int speed = content["speed"];
  analogWrite(device.pin, speed);
}

std::map<String, void(*)(Device&, JsonDocument&)> deviceHandlers {
  {"Led", handleLed}, 
  {"Fan", handleFan}
};

void setup() {
  Serial.begin(9600);
  btSerial.begin(9600);
}

void loop() {
  if(btSerial.available()){
    String command = btSerial.readStringUntil('\n');
    parseData(command);
  }
}

void parseData(String jsonCommand) {
  DeserializationError error = deserializeJson(content, jsonCommand);
  if (deserializeJson(content, jsonCommand)) {
    btSerial.println("JSON Couldn't be parsed");
    return;
  };
  const String deviceType = content["deviceType"];
  Device device = {
    content["pin"],
    content["mode"],
    content["state"]
  };
  pinMode(device.pin, device.mode);
  deviceHandlers[deviceType](device, content);
}