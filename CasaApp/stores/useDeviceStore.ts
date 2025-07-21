import { setBrightness, setDeviceState } from "@/lib/deviceController";
import { Device } from "@/types/Device";
import { Result } from "@/types/Response";
import { create } from "zustand";

interface PendingChange {
  function: Promise<Result<any>>
  timestamp: number;
}

interface DeviceState {
  devices: Device[];
  pendingChanges: PendingChange[];
  handleLoadDevices: (newDevices: Device[]) => void;
  getDeviceById: (deviceId: number) => Result<Device>;
  toggleDeviceState: (deviceId: number, newState: boolean) => void;
  setDeviceBrightness: (deviceId: number, brightness: number) => void;
  syncChanges: () => Promise<Result<boolean>>;
}

const useDeviceStore = create<DeviceState>()((set, get) => ({
  devices: [],
  pendingChanges: [],
  isLoadingDevices: false,
  handleLoadDevices: (newDevices) => {
    set((state) => ({ ...state, devices: newDevices }));
  },
  getDeviceById: (deviceId) => {
    const device = get().devices.find((device) => device.id === deviceId);
    if (device === undefined) {
      return Result.failure(["El dispositivo con ID: " + deviceId + "no fue encontrado"]);
    }
    return Result.success(device);
  },
  toggleDeviceState: async (deviceId: number, newState: boolean) => {
    set((state) => {
      const updatedDevices = state.devices.map((device) =>
        device.id === deviceId
          ? { ...device, state: newState }
          : device
      );
      const change: PendingChange = { 
        function: setDeviceState(deviceId, newState),
        timestamp: Date.now() 
      };
      
      return { 
        devices: updatedDevices,
        pendingChanges: [...state.pendingChanges, change]
      };
    });
  },
  setDeviceBrightness: async (deviceId: number, brightness: number) => {
    set((state) => {
      const updatedDevices = state.devices.map((device) =>
        device.id === deviceId
          ? { ...device, brightness }
          : device
      );
      const change: PendingChange = { 
        function: setBrightness(deviceId, brightness),
        timestamp: Date.now() 
      };
      return {
        devices: updatedDevices,
        pendingChanges: [...state.pendingChanges, change]
      };
    });
  },
  syncChanges: async () => {
    const { pendingChanges } = get();
    if (pendingChanges.length === 0) return Result.success(true);

    const changesToProcess = [...pendingChanges];
    set((state) => ({ ...state, pendingChanges: [] }));

    let errors : string[] = [];

    const results = await Promise.all(
      changesToProcess.map(change => change.function)
    );

    results.forEach(result => {
      if (!result.isSuccess) {
        errors = errors.concat(result.errors);
      }
    });

    if(errors.length > 0){
      return Result.failure(errors);
    }
    return Result.success(true);
  },
}));

export default useDeviceStore;
