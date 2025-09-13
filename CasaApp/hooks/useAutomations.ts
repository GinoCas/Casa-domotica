import { Automation } from "@/src/core/entities/Automation";
import useAutomationStore from "@/stores/useAutomationStore";
import useDeviceStore from "@/stores/useDeviceStore";
import useModeStore from "@/stores/useModeStore";
import { useEffect } from "react";

function triggerAutomation(auto: Automation, end: boolean) {
  const { getDeviceById, toggleDeviceState } = useDeviceStore.getState();
  auto.devices.forEach((automationDevice) => {
    const deviceResult = getDeviceById(automationDevice.id);

    if (deviceResult.isSuccess) {
      const device = deviceResult.data as any; // The type is wrong in the store, so using any
      const targetState = end
        ? !automationDevice.autoState
        : automationDevice.autoState;
      if (end && device.state === false) {
        return;
      }
      toggleDeviceState(automationDevice.id, targetState);
    }
  });
}

export default function useAutomation() {
  const {
    automations,
    isLoadingAutomation,
    fetchAllAutomations,
    createAutomation,
    deleteAutomation,
    updateAutomation,
  } = useAutomationStore();

  useEffect(() => {
    fetchAllAutomations();
  }, [fetchAllAutomations]);

  const getAutomationById = (id: number) => {
    return automations.find((auto) => auto.id === id);
  };

  const checkAutomationsTriggers = (time: string) => {
    const { activityMode } = useModeStore.getState();
    if (activityMode) return;

    const matchingAutomations = automations.filter(
      (auto) =>
        (auto.initTime.trim() === time || auto.endTime.trim() === time) &&
        auto.state,
    );

    matchingAutomations.forEach((auto) => {
      triggerAutomation(auto, auto.endTime.trim() === time);
    });
  };

  return {
    automations,
    isLoadingAutomation,
    createAutomation,
    deleteAutomation,
    updateAutomation,
    getAutomationById,
    checkAutomationsTriggers,
    fetchAllAutomations,
  };
}
