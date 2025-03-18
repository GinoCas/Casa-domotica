import { Automation } from "@/types/Automation";
import { create } from "zustand";

interface AutomationState {
  automations: Automation[];
  handleLoadAutomations: (newAutomations: Automation[]) => void;
  addAutomation: (newAutomation: Automation) => void;
  updateAutomation: (updatedAuto: Automation) => void;
  deleteAutomation: (id: number) => void;
}

const useAutomationStore = create<AutomationState>()((set) => ({
  automations: [],
  handleLoadAutomations: (newAutomations) =>
    set((state) => ({ ...state, automations: newAutomations })),

  addAutomation: (newAutomation) =>
    set(({ automations, ...state }) => {
      //saveToAutomationFile(newAutomation) # Se modifica el json
      return {
        ...state,
        automations: [...automations, newAutomation],
      };
    }),

  deleteAutomation: (id) =>
    set((state) => ({
      automations: state.automations.filter((auto) => auto.id !== id),
    })),

  updateAutomation: (updatedAuto) =>
    set((state) => {
      const updatedAutomations = state.automations.map((auto) =>
        auto.id === updatedAuto.id ? { ...auto, ...updatedAuto } : auto
      );
      return { automations: updatedAutomations };
    }),
}));

export default useAutomationStore;
