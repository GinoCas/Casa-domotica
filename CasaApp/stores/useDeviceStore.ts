import { deviceService } from "@/src/services/DeviceService";
import { create } from "zustand";
import { Result } from "@/src/shared/Result";
import { Device } from "@/src/core/entities/Device";
import { DeviceDto } from "@/src/application/dtos/DeviceDto";

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
  setDeviceBrightness: (deviceId: number, brightness: number) => Promise<void>;
  updateDevice: (deviceId: number, dto: DeviceDto) => Promise<void>;
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
        const updatedDevices = state.devices.map((device) =>
          device.id === deviceId
            ? {
                ...device,
                state: newState,
              }
            : device,
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
    set((state) => ({
      devices: state.devices.map((device) => {
        if (device.id === deviceId) {
          const newCapabilities = device.capabilities.map((c) => {
            if (c.capabilityType === "Dimmable") {
              return { ...c, brightness };
            }
            return c;
          });
          return { ...device, capabilities: newCapabilities };
        }
        return device;
      }),
    }));
  },
  updateDevice: async (deviceId: number, dto: DeviceDto) => {
    const result = await deviceService.updateDevice(deviceId, dto);
    if (!result.isSuccess) {
      console.log("Error on updating device", result.errors);
      return;
    }
    const devicesResult = await deviceService.getDeviceList();
    if (!devicesResult.isSuccess) {
      console.log("Error on loading devices", devicesResult.errors);
      return;
    }
    get().handleLoadDevices(devicesResult.data);
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
