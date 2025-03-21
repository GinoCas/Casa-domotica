import { getDeviceById, updateDevice } from "@/lib/deviceController";
import useAutomationStore from "@/stores/useAutomationStore";
import useModeStore from "@/stores/useModeStore";
import { Automation } from "@/types/Automation";

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

export default function useAutomation() {
  const {
    createAutomation,
    automations,
    deleteAutomation,
    handleLoadAutomations,
    updateAutomation,
  } = useAutomationStore();

  const getAutomationById = (id: number) => {
    const findedAutomation = automations.find((auto) => auto.id === id);
    return findedAutomation;
  };

  const checkAutomationsTriggers = (time: string) => {
    const { automations } = useAutomationStore.getState();
    const { activityMode } = useModeStore.getState();
    if (activityMode) return;
    const matchingAutomations = automations.filter(
      (auto) =>
        (auto.initTime.trim() === time || auto.endTime.trim() === time) &&
        auto.state,
    );
    matchingAutomations.forEach((auto: Automation) => {
      triggerAutomation(auto, auto.endTime.trim() === time);
    });
  };

  return {
    createAutomation,
    automations,
    deleteAutomation,
    updateAutomation,
    handleLoadAutomations,
    getAutomationById,
    checkAutomationsTriggers,
  };
}
