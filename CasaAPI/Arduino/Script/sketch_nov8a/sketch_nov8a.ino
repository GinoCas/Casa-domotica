#include <ArxContainer.h>
#include <ArduinoJson.h>

StaticJsonDocument<200> content;

struct Device {
  int id;
  int pin;
  int mode;
  void ToggleState(bool state){
    digitalWrite(pin, state);
  }
};

void handleLed(Device& device, JsonDocument& content) {
  Serial.println("Increible");
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
    content["mode"]
  };
  pinMode(device.pin, device.mode);
  device.ToggleState((bool)content["state"]);
  deviceHandlers[deviceType](device, content);
}