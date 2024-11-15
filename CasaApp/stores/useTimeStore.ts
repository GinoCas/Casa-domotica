import { create } from "zustand";

interface TimeState {
  globalTime: Date;
  changeGlobalTime: (newHour: Date) => void;
}

const useTimeStore = create<TimeState>()((set) => ({
  globalTime: new Date(),
  changeGlobalTime: (newHour) =>
    set((state) => ({ ...state, globalTime: newHour })),
}));

export default useTimeStore;
