import AutomationsData from "@/stores/automations.json";
import { Automation } from "@/types/automation";
import getTimeString from "@/Utils/getTimeString";
import { GetDeviceById, UpdateDevice } from "./deviceController";

export function GetAutomationById(id: number) {
  const autoIndex = AutomationsData.findIndex((auto) => auto.id === id);
  return AutomationsData[autoIndex] as Automation;
}

export function checkAutomationsTriggers(time: string) {
  const matchingAutomations = AutomationsData.filter(
    (auto) => auto.initTime.trim() === time || auto.endTime.trim() === time
  );
  matchingAutomations.forEach((auto: Automation) => {
    triggerAutomation(auto);
  });
}

function triggerAutomation(auto: Automation) {
  auto.devices.forEach((newDevice) => {
    let device = GetDeviceById(newDevice.id);
    device.baseProperties.state = newDevice.state;
    UpdateDevice(device);
  });
}
