import { Automation } from "@/types/Automation";
import { getDeviceById, updateDevice } from "./deviceController";
import useModeStore from "@/stores/useModeStore";
import useAutomationStore from "@/stores/useAutomationStore";

export function getAutomationById(id: number) {
  const { automations } = useAutomationStore.getState();
  return automations.find((auto) => auto.id === id);
}

export function checkAutomationsTriggers(time: string) {
  const { automations } = useAutomationStore.getState();
  const { activityMode } = useModeStore.getState();
  if (activityMode) return;
  const matchingAutomations = automations.filter(
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
    let device = getDeviceById(newDevice.id);
    if (end && device.baseProperties.state === false) {
      return;
    }
    device.baseProperties.state = end ? !newDevice.state : newDevice.state;
    updateDevice(device);
  });
}
