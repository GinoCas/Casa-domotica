import { Automation } from "@/types/Automation";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AutomationsData from "@/stores/automations.json";

interface AutomationState {
  automations: Automation[];
  handleLoadAutomations: (newAutomations: Automation[]) => void;
  addAutomation: (newAutomation: Automation) => void;
  updateAutomation: (updatedAuto: Automation) => void;
  deleteAutomation: (id: number) => void;
}

const useAutomationStore = create<AutomationState>()(
  persist(
    (set) => ({
      automations: AutomationsData,
      handleLoadAutomations: (newAutomations) =>
        set((state) => ({ ...state, automations: newAutomations })),
      addAutomation: (newAutomation) =>
        set(({ automations, ...state }) => ({
          ...state,
          automations: [...automations, newAutomation],
        })),
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
