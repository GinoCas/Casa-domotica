#include <ArxContainer.h>
#include <ArduinoJson.h>

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

void setup(){
  Serial.begin(9600);
  // Placeholder data for devices
  devices.push_back({2, false});
  devices.push_back({3, false});
  devices.push_back({4, false});

  // Placeholder data for automations
  automations.push_back({10, 30, 12, 30, {{1, true}, {2, true}}});
  automations.push_back({18, 0, 20, 0, {{3, true}, {4, true}}});
}

void loop(){
  StaticJsonDocument<1024> doc;

  JsonArray devicesArray = doc.createNestedArray("data");
  int devId = 0;
  for (const auto& device : devices) {
    devId++;
    JsonObject deviceObj = devicesArray.createNestedObject();
    deviceObj["Id"] = devId;
    deviceObj["State"] = device.state;
  }

  /*JsonArray automationsArray = doc.createNestedArray("automations");
  for (const auto& automation : automations) {
    JsonObject automationObj = automationsArray.createNestedObject();
    automationObj["initHour"] = automation.initHour;
    automationObj["initMinute"] = automation.initMinute;
    automationObj["endHour"] = automation.endHour;
    automationObj["endMinute"] = automation.endMinute;
    JsonObject devicesStateObj = automationObj.createNestedObject("devicesState");
    for (const auto& pair : automation.devicesState) {
      devicesStateObj[String(pair.first)] = pair.second;
    }
  }*/

  serializeJson(doc, Serial);
  Serial.println();
  delay(5000);
}