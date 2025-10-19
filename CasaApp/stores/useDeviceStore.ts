import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Result } from "@/src/shared/Result";
import { Device } from "@/src/core/entities/Device";

interface DeviceStoreState {
  devices: Record<number, Device>;
  isLoadingDevices: boolean;
  handleLoadDevices: (newDevices: Device[]) => void;
  changeLoadingDevices: (newState: boolean) => void;
  getDeviceById: (deviceId: number) => Result<Device>;
  setDeviceState: (deviceId: number, newState: boolean) => void;
  setDeviceBrightness: (deviceId: number, brightness: number) => void;
}

const useDeviceStore = create<DeviceStoreState>()(
  immer((set, get) => ({
    devices: {},
    isLoadingDevices: false,
    handleLoadDevices: (newDevices: Device[]) => {
      set((state) => {
        state.devices = newDevices.reduce(
          (acc, device) => {
            acc[device.id] = device;
            return acc;
          },
          {} as Record<number, Device>,
        );
      });
    },
    changeLoadingDevices: (newState: boolean) =>
      set((state) => {
        state.isLoadingDevices = newState;
      }),
    getDeviceById: (deviceId: number) => {
      const device = get().devices[deviceId];
      if (!device) {
        return Result.failure([
          "El dispositivo con ID: " + deviceId + " no fue encontrado",
        ]);
      }
      return Result.success(device);
    },
    setDeviceState: (deviceId: number, newState: boolean) => {
      set((state) => {
        const device = state.devices[deviceId];
        if (device) {
          device.state = newState;
        }
      });
    },
    setDeviceBrightness: (deviceId: number, brightness: number) => {
      set((state) => {
        const device = state.devices[deviceId];
        if (device) {
          const capability = device.capabilities.find(
            (c) => c.capabilityType === "Dimmable",
          );
          if (capability) {
            capability.brightness = brightness;
          }
        }
      });
    },
  })),
);

export default useDeviceStore;
