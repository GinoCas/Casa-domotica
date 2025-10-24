import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DependencyContainer } from "@/src/shared/DependencyContainer";

interface ConfigState {
  arduinoIp: string;
  setArduinoIp: (ip: string) => void;
}

const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      arduinoIp: process.env.EXPO_PUBLIC_ARDUINO_LOCAL_IP || "",
      setArduinoIp: (ip: string) => {
        const norm = (ip || "").trim();
        try {
          DependencyContainer.getInstance().setLocalUrl(norm);
        } catch (err) {
          console.log("Error actualizando URL local:", err);
        }
        set({ arduinoIp: norm });
      },
    }),
    {
      name: "config-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ arduinoIp: state.arduinoIp }),
      onRehydrateStorage: () => (state) => {
        try {
          const ip =
            state?.arduinoIp ??
            (process.env.EXPO_PUBLIC_ARDUINO_LOCAL_IP || "");
          DependencyContainer.getInstance().setLocalUrl(ip);
        } catch (err) {
          console.log("Error rehidratando URL local:", err);
        }
      },
    },
  ),
);

export default useConfigStore;
