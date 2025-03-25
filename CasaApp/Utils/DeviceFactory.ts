import { Device, DeviceType, Illuminable, Rotatable } from "@/types/Device";

export function createDevice(deviceType: DeviceType) {
  const baseDevice: Device = {
    type: deviceType,
    id: 0,
    pin: 0,
    state: false,
    voltage: 0,
    amperes: 0,
  };
  switch (deviceType) {
    case "Led":
      return {
        ...baseDevice,
        type: "Led",
      } as Device & Illuminable;
    case "Fan":
      return {
        ...baseDevice,
        type: "Fan",
      } as Device & Rotatable;
  }
  return baseDevice;
}
