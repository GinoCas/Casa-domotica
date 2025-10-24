import { create } from "zustand";
import { modeService } from "@/src/services/ModeService";
import { ArduinoModeDto } from "@/src/application/dtos/ArduinoModeDto";
import { Mode } from "@/src/core/entities/Mode";

interface ModeState {
  saveEnergyMode: boolean;
  activityMode: boolean;
  changeSaveEnergyMode: (newState: boolean) => Promise<void>;
  changeActivityMode: (newState: boolean) => Promise<void>;
  handleLoadModes: (modes: Mode[]) => void;
}

const useModeStore = create<ModeState>()((set) => ({
  saveEnergyMode: false,
  activityMode: false,
  changeActivityMode: async (newState: boolean) => {
    set((state) => ({ ...state, activityMode: newState }));
    const dto = new ArduinoModeDto("Activity", newState);
    const result = await modeService.controlMode(dto);
    if (!result.isSuccess) {
      set((state) => ({ ...state, activityMode: !newState }));
    }
  },
  changeSaveEnergyMode: async (newState: boolean) => {
    set((state) => ({ ...state, saveEnergyMode: newState }));
    const dto = new ArduinoModeDto("SaveEnergy", newState);
    const result = await modeService.controlMode(dto);
    if (!result.isSuccess) {
      set((state) => ({ ...state, saveEnergyMode: !newState }));
    }
  },
  handleLoadModes: (modes: Mode[]) => {
    const activity = modes.find(
      (m) => m.name?.toLowerCase() === "activity"
    );
    const saveEnergy = modes.find(
      (m) => m.name?.toLowerCase() === "saveenergy"
    );
    set((state) => ({
      ...state,
      activityMode: Boolean(activity?.state),
      saveEnergyMode: Boolean(saveEnergy?.state),
    }));
  },
}));

export default useModeStore;
