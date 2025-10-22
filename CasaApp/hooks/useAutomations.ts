import { Automation } from "@/src/core/entities/Automation";
import { getDeviceById, toggleDevices } from "@/src/services/DeviceActions";
import useAutomationStore from "@/stores/useAutomationStore";
import useModeStore from "@/stores/useModeStore";
import { useEffect } from "react";
import { automationService } from "@/src/services/AutomationService";
import {
  mergeAutomations,
  loadAutomations,
  deleteAutomation,
  controlAutomation,
  updateAutomation,
} from "@/src/services/AutomationActions";

function triggerAutomation(auto: Automation, end: boolean) {
  const updates: { deviceId: number; newState: boolean }[] = [];
  auto.devices.forEach((automationDevice) => {
    const deviceResult = getDeviceById(automationDevice.id);

    if (deviceResult.isSuccess) {
      const device = deviceResult.data as any;
      const targetState = end
        ? !automationDevice.autoState
        : automationDevice.autoState;
      if (end && device.state === false) {
        return;
      }
      updates.push({ deviceId: automationDevice.id, newState: targetState });
    }
  });

  if (updates.length > 0) {
    toggleDevices(updates);
  }
}

export default function useAutomation() {
  const { automations, isLoadingAutomation } = useAutomationStore();

  useEffect(() => {
    loadAutomations();
  }, []);

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
    deleteAutomation: deleteAutomation,
    controlAutomation: controlAutomation,
    updateAutomation: updateAutomation,
    getAutomationById,
    checkAutomationsTriggers,
    fetchAllAutomations: loadAutomations,
  };
}
