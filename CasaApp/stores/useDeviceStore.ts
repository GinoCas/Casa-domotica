import { deviceService } from "@/src/services/DeviceService";
import { create } from "zustand";
import { Result } from "@/src/shared/Result";
import { Device } from "@/src/core/entities/Device";

interface PendingChange {
  function: Promise<Result<any>>;
  timestamp: number;
}
interface DeviceStoreState {
  devices: Device[];
  pendingChanges: PendingChange[];
  handleLoadDevices: (newDevices: Device[]) => void;
  getDeviceById: (deviceId: number) => Result<Device>;
  toggleDeviceState: (deviceId: number, newState: boolean) => Promise<void>;
  setDeviceBrightness: (deviceId: number, brightness: number) => void;
  syncChanges: () => Promise<Result<boolean>>;
}

const useDeviceStore = create<DeviceStoreState>()((set, get) => ({
  devices: [],
  pendingChanges: [],
  handleLoadDevices: (newDevices: Device[]) => {
    set((state) => ({ ...state, devices: newDevices }));
  },
  getDeviceById: (deviceId: number) => {
    const deviceWithState = get().devices.find(
      (item: Device) => item.id === deviceId,
    );
    if (deviceWithState === undefined) {
      return Result.failure([
        "El dispositivo con ID: " + deviceId + " no fue encontrado",
      ]);
    }
    return Result.success(deviceWithState);
  },
  toggleDeviceState: async (deviceId: number, newState: boolean) => {
    // Primero intentamos ejecutar el comando
    const result = await deviceService.setDeviceState(deviceId, newState);

    if (result.isSuccess) {
      // Solo actualizamos el estado local si el comando fue exitoso
      set((state) => {
        const updatedDevices = state.devices.map((deviceWithState) =>
          deviceWithState.device.id === deviceId
            ? {
                ...deviceWithState,
                state: newState,
              }
            : deviceWithState,
        );
        return {
          ...state,
          devices: updatedDevices,
        };
      });
    } else {
      // Podrías manejar el error aquí, por ejemplo, mostrando una notificación
      console.error("Error toggling device state:", result.errors);
    }
  },
  setDeviceBrightness: async (deviceId: number, brightness: number) => {
    set((state) => {
      const updatedDevices = state.devices.map((deviceWithState) =>
        deviceWithState.device.id === deviceId
          ? { ...deviceWithState, brightness }
          : deviceWithState,
      );
      const change: PendingChange = {
        function: deviceService.setBrightness(deviceId, brightness),
        timestamp: Date.now(),
      };
      return {
        ...state,
        devices: updatedDevices,
        pendingChanges: [...state.pendingChanges, change],
      };
    });
  },
  syncChanges: async () => {
    const { pendingChanges } = get();
    if (pendingChanges.length === 0) return Result.success(true);

    const changesToProcess = [...pendingChanges];
    set((state) => ({ ...state, pendingChanges: [] }));

    let errors: string[] = [];

    const results = await Promise.all(
      changesToProcess.map((change) => change.function),
    );

    results.forEach((result: Result<any>) => {
      if (!result.isSuccess) {
        errors = errors.concat(result.errors);
      }
    });

    if (errors.length > 0) {
      return Result.failure(errors);
    }
    return Result.success(true);
  },
}));

export default useDeviceStore;
