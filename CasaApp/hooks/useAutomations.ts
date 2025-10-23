import useAutomationStore from "@/stores/useAutomationStore";
import { useEffect } from "react";
import { automationService } from "@/src/services/AutomationService";
import {
  mergeAutomations,
  loadAutomations,
  deleteAutomation,
  controlAutomation,
  updateAutomation,
  createAutomation,
} from "@/src/services/AutomationActions";
import { parseTimeToISO8601String } from "@/Utils/parseTimeString";

export default function useAutomation() {
  const { automations, isLoadingAutomation } = useAutomationStore();

  useEffect(() => {
    loadAutomations();
  }, []);

  useEffect(() => {
    const intervalMs = 10000;
    const interval = setInterval(async () => {
      const baseline = useAutomationStore.getState().lastModified;
      const result = await automationService.getAutomationsModifiedAfter(
        parseTimeToISO8601String(baseline),
      );
      if (result.isSuccess && result.data.length) {
        mergeAutomations(result.data);
        useAutomationStore.getState().setLastModified(new Date());
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, []);

  const getAutomationById = (id: number) => {
    return automations.find((auto) => auto.id === id);
  };

  return {
    automations,
    isLoadingAutomation,
    deleteAutomation: deleteAutomation,
    controlAutomation: controlAutomation,
    updateAutomation: updateAutomation,
    createAutomation,
    getAutomationById,
    fetchAllAutomations: loadAutomations,
  };
}
