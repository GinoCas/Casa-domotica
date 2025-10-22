import { AutomationDto } from "@/src/application/dtos/AutomationDto";
import { Automation } from "@/src/core/entities/Automation";
import { automationService } from "@/src/services/AutomationService";
import { Result } from "@/src/shared/Result";
import { create } from "zustand";

interface AutomationState {
  automations: Automation[];
  isLoadingAutomation: boolean;
  fetchAllAutomations: () => Promise<void>;
  //createAutomation: () => Promise<Automation | null>;
  controlAutomation: (updatedAuto: Automation) => Promise<void>;
  updateAutomation: (
    id: number,
    name: string,
    description: string,
  ) => Promise<void>;
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
    const result = await Result.failure(["Not implemented."]); //await automationService.controlAutomation();
    if (result.isSuccess) {
      //set((state) => ({ automations: [...state.automations, result.data] }));
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
  controlAutomation: async (updatedAuto) => {
    set({ isLoadingAutomation: true });
    const result = await automationService.controlAutomation(updatedAuto);
    if (result.isSuccess) {
      console.log("Data automation:", result.data);
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
  updateAutomation: async (id, name, description) => {
    set({ isLoadingAutomation: true });
    const result = await automationService.updateAutomation(
      id,
      new AutomationDto(name, description),
    );
    if (result.isSuccess) {
      set((state) => {
        const updatedAutomations = state.automations.map((auto) =>
          auto.id === id ? result.data : auto,
        );
        return { automations: updatedAutomations, loading: false };
      });
    } else {
      set({ isLoadingAutomation: false });
    }
  },
}));

export default useAutomationStore;
