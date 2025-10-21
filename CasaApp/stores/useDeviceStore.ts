import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Device } from "@/src/core/entities/Device";

interface DeviceStoreState {
  devices: Record<number, Device>;
  isLoadingDevices: boolean;
  lastModified: Date;
  handleLoadDevices: (newDevices: Device[]) => void;
  changeLoadingDevices: (newState: boolean) => void;
  setLastModified: (date: Date) => void;
}

const useDeviceStore = create<DeviceStoreState>()(
  immer((set) => ({
    devices: {},
    isLoadingDevices: false,
    lastModified: new Date(),
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
    setLastModified: (date: Date) =>
      set((state) => {
        state.lastModified = date;
      }),
  })),
);

export default useDeviceStore;
