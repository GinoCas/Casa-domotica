import { Automation } from "@/types/Automation";
import { GetDeviceById, UpdateDevice } from "./deviceController";
import useModeStore from "@/stores/useModeStore";
import useAutomationStore from "@/stores/useAutomationStore";

export function checkAutomationsTriggers(time: string) {
  const { activityMode } = useModeStore.getState();
  const { automations } = useAutomationStore.getState();
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
    let device = GetDeviceById(newDevice.id);
    if (end && device.baseProperties.state === false) {
      return;
    }
    device.baseProperties.state = end ? !newDevice.state : newDevice.state;
    UpdateDevice(device);
  });
}
