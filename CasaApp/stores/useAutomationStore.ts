import { Automation } from "@/src/core/entities/Automation";
import { automationService } from "@/src/services/AutomationService";
import { create } from "zustand";

interface AutomationState {
  automations: Automation[];
  isLoadingAutomation: boolean;
  fetchAllAutomations: () => Promise<void>;
  createAutomation: () => Promise<Automation | null>;
  updateAutomation: (updatedAuto: Automation) => Promise<void>;
  deleteAutomation: (id: number) => Promise<void>;
}

const useAutomationStore = create<AutomationState>((set, get) => ({
  automations: [],
  isLoadingAutomation: false,
  error: null,
  fetchAllAutomations: async () => {
    set({ isLoadingAutomation: true });
    const result = await automationService.getAllAutomations();
    if (result.isSuccess) {
      set({ automations: result.data, isLoadingAutomation: false });
    } else {
      set({ isLoadingAutomation: false });
    }
  },
  createAutomation: async () => {
    set({ isLoadingAutomation: true });
    const result = await automationService.createAutomation();
    if (result.isSuccess) {
      set((state) => ({ automations: [...state.automations, result.data] }));
      set({ isLoadingAutomation: false });
      return result.data;
    } else {
      set({ isLoadingAutomation: false });
      return null;
    }
  },
  deleteAutomation: async (id) => {
    set({ isLoadingAutomation: true });
    const result = await automationService.deleteAutomation(id);
    if (result.isSuccess) {
      set((state) => ({
        automations: state.automations.filter((auto) => auto.id !== id),
        loading: false,
      }));
    } else {
      set({ isLoadingAutomation: false });
    }
  },
  updateAutomation: async (updatedAuto) => {
    set({ isLoadingAutomation: true });
    const result = await automationService.updateAutomation(updatedAuto);
    if (result.isSuccess) {
      set((state) => {
        const updatedAutomations = state.automations.map((auto) =>
          auto.id === updatedAuto.id ? result.data : auto,
        );
        return { automations: updatedAutomations, loading: false };
      });
    } else {
      set({ isLoadingAutomation: false });
    }
  },
}));

export default useAutomationStore;
