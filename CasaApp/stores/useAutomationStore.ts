import { Automation } from "@/types/Automation";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AutomationsData from "@/stores/automations.json";

interface AutomationState {
  automations: Automation[];
  handleLoadAutomations: (newAutomations: Automation[]) => void;
  createAutomation: () => Automation;
  updateAutomation: (updatedAuto: Automation) => void;
  deleteAutomation: (id: number) => void;
}

const useAutomationStore = create<AutomationState>()(
  persist(
    (set, get) => ({
      automations: AutomationsData,
      handleLoadAutomations: (newAutomations) =>
        set((state) => ({ ...state, automations: newAutomations })),
      createAutomation: () => {
        const automations = get().automations;
        const autoId = Math.max(0, ...automations.map((auto) => auto.id)) + 1;
        const template: Automation = {
          id: autoId + 1,
          title: "New Automation",
          description: "Automation description",
          devices: [],
          initTime: "08:00",
          endTime: "20:00",
          state: false,
        };
        set((state) => ({
          automations: [...state.automations, template],
        }));
        return template;
      },
      deleteAutomation: (id) =>
        set((state) => ({
          automations: state.automations.filter((auto) => auto.id !== id),
        })),
      updateAutomation: (updatedAuto) =>
        set((state) => {
          const updatedAutomations = state.automations.map((auto) =>
            auto.id === updatedAuto.id ? { ...auto, ...updatedAuto } : auto,
          );
          return { automations: updatedAutomations };
        }),
    }),
    {
      name: "automation-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAutomationStore;
