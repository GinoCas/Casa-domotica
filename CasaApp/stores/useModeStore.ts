import { create } from "zustand";

interface ModeState {
  saveEnergyMode: boolean;
  activityMode: boolean;
  changeSaveEnergyMode: (newState: boolean) => void;
  changeActivityMode: (newState: boolean) => void;
}

const useModeStore = create<ModeState>()((set) => ({
  saveEnergyMode: false,
  activityMode: false,
  changeActivityMode: (newState) =>
    set((state) => ({ ...state, activityMode: newState })),
  changeSaveEnergyMode: (newState) =>
    set((state) => ({ ...state, saveEnergyMode: newState })),
}));

export default useModeStore;
