import { Device } from "@/types/Device";
import { create } from "zustand";
import DevicesData from "@/stores/devices.json";

interface DeviceState {
  devices: Device[];
  handleLoadDevices: (newDevices: Device[]) => void;
  getDeviceById: (id: number) => Device | undefined;
  updateDevice: (updatedDevice: Device) => void;
}

const useDeviceStore = create<DeviceState>()((set, get) => ({
  devices: DevicesData as Device[],
  handleLoadDevices: (newDevices) => {
    set((state) => ({ ...state, devices: newDevices }));
  },
  getDeviceById: (id) => {
    return get().devices.find((device) => device.id === id);
  },
  updateDevice: (updatedDevice) => {
    set((state) => {
      const updatedDevices = state.devices.map((device) =>
        device.id === updatedDevice.id
          ? { ...device, ...updatedDevice }
          : device,
      );
      return { devices: updatedDevices };
    });
  },
}));

export default useDeviceStore;
