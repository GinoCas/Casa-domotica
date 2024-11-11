#include <ArxContainer.h>
#include <ArduinoJson.h>

StaticJsonDocument<200> content;

struct Device {
  int id;
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
}

void loop() {
  if(Serial.available()){
    parseData(Serial.readStringUntil('\n'));
  }
}

void parseData(String jsonCommand) {
  DeserializationError error = deserializeJson(content, jsonCommand);
  if (deserializeJson(content, jsonCommand)) {
    Serial.println("JSON Couldn't be parsed");
    return;
  };
  const String deviceType = content["deviceType"];
  Device device = {
    content["id"],
    content["pin"],
    content["mode"],
    content["state"]
  };
  pinMode(device.pin, device.mode);
  deviceHandlers[deviceType](device, content);
}