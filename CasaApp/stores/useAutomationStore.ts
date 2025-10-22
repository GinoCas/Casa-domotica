import { Automation } from "@/src/core/entities/Automation";
import { create } from "zustand";

interface AutomationState {
  automations: Automation[];
  isLoadingAutomation: boolean;
  lastModified: Date;
  setLastModified: (date: Date) => void;
  handleLoadAutomations: (newAutomations: Automation[]) => void;
  changeLoadingAutomation: (newState: boolean) => void;
}

const useAutomationStore = create<AutomationState>((set) => ({
  automations: [],
  isLoadingAutomation: false,
  lastModified: new Date(),
  setLastModified: (date: Date) => set({ lastModified: date }),
  handleLoadAutomations: (newAutomations: Automation[]) =>
    set({ automations: newAutomations }),
  changeLoadingAutomation: (newState: boolean) =>
    set({ isLoadingAutomation: newState }),
}));

export default useAutomationStore;
