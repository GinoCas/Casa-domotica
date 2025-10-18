import { deviceService } from "@/src/services/DeviceService";
import { create } from "zustand";
import { Result } from "@/src/shared/Result";
import { Device } from "@/src/core/entities/Device";
import { DeviceDto } from "@/src/application/dtos/DeviceDto";
import { ArduinoDeviceDto } from "@/src/application/dtos/ArduinoDeviceDto";

interface DeviceStoreState {
  devices: Device[];
  handleLoadDevices: (newDevices: Device[]) => void;
  isLoadingDevices: boolean;
  changeLoadingDevices: (newState: boolean) => void;
  getDeviceById: (deviceId: number) => Result<Device>;
  toggleDeviceState: (deviceId: number, newState: boolean) => Promise<void>;
  setDeviceBrightness: (deviceId: number, brightness: number) => Promise<void>;
  updateDevice: (deviceId: number, dto: DeviceDto) => Promise<void>;
  refreshDevices: () => Promise<void>;
}

const useDeviceStore = create<DeviceStoreState>()((set, get) => ({
  devices: [],
  isLoadingDevices: false,
  handleLoadDevices: (newDevices: Device[]) => {
    set((state) => ({ ...state, devices: newDevices }));
  },
  changeLoadingDevices: (newState) =>
    set((state) => ({ ...state, isLoadingDevices: newState })),
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
    const dto = new ArduinoDeviceDto(deviceId, newState);
    const result = await deviceService.controlDevice(dto);

    if (result.isSuccess) {
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
    try {
      set({ isLoadingDevices: true });
      const result = await deviceService.updateDevice(deviceId, dto);
      if (!result.isSuccess) {
        throw new Error(result.errors.join(","));
      }
    } catch (err) {
      console.log("Error on updating device:" + err);
    } finally {
      set({ isLoadingDevices: false });
    }
    const devicesResult = await deviceService.getDeviceList();
    if (!devicesResult.isSuccess) {
      console.log("Error on loading devices", devicesResult.errors);
      return;
    }
    get().handleLoadDevices(devicesResult.data);
  },
  // Implementación de refresco manual (pull-to-refresh)
  refreshDevices: async () => {
    try {
      set({ isLoadingDevices: true });
      const devicesResult = await deviceService.getDeviceList();
      if (!devicesResult.isSuccess) {
        console.log("Error on loading devices", devicesResult.errors);
        return;
      }
      set({ devices: devicesResult.data });
    } finally {
      set({ isLoadingDevices: false });
    }
  },
}));

export default useDeviceStore;
