import AutomationsData from "@/stores/automations.json";
import { Automation } from "@/types/Automation";
import { GetDeviceById, UpdateDevice } from "./deviceController";
import Device from "@/types/Device";
import useModeStore from "@/stores/useModeStore";

export function GetAutomationById(id: number) {
  const autoIndex = AutomationsData.findIndex((auto) => auto.id === id);
  return AutomationsData[autoIndex] as Automation;
}

export function UpdateAutomation(updatedAuto: Automation) {
  const deviceIndex = AutomationsData.findIndex(
    (auto) => auto.id === updatedAuto.id
  );
  AutomationsData[deviceIndex] = {
    ...AutomationsData[deviceIndex],
    ...updatedAuto,
  };
}

export function GetAutomationDeviceList(id: number) {
  let deviceList: Device[] = [];
  GetAutomationById(id).devices.forEach((dev) => {
    const device = GetDeviceById(dev.id);
    device.baseProperties.state = dev.state;
    deviceList.push(GetDeviceById(dev.id));
  });
  return deviceList;
}

export function checkAutomationsTriggers(time: string) {
  const { activityMode } = useModeStore.getState();
  if (activityMode) return;
  const matchingAutomations = AutomationsData.filter(
    (auto) =>
      (auto.initTime.trim() === time || auto.endTime.trim() === time) &&
      auto.state
  );
  matchingAutomations.forEach((auto: Automation) => {
    triggerAutomation(auto, auto.endTime.trim() === time);
  });
}

function triggerAutomation(auto: Automation, end: boolean) {
  auto.devices.forEach((newDevice) => {
    let device = GetDeviceById(newDevice.id);
    if (end && device.baseProperties.state === false) {
      return;
    }
    device.baseProperties.state = end ? !newDevice.state : newDevice.state;
    UpdateDevice(device);
  });
}
