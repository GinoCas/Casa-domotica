import { Device, DeviceType } from "@/src/core/entities/Device";

// Definir interfaces localmente ya que no existen en el core
interface IDimmable {
  brightness: number;
}

interface IVelocity {
  speed: number;
}

export function createDevice(deviceType: DeviceType) {
  const baseDevice: Device = {
    deviceType: deviceType,
    id: 0,
    state: false,
    name: "",
    description: "",
    capabilities: [],
  };
  
  switch (deviceType) {
    case "Led":
      return {
        ...baseDevice,
        deviceType: "Led",
        capabilities: [{ capabilityType: "Dimmable", brightness: 0 }],
      } as Device;
    case "Fan":
      return {
        ...baseDevice,
        deviceType: "Fan", 
        capabilities: [{ capabilityType: "Velocity", speed: 0 }],
      } as Device;
    case "Tv":
      return {
        ...baseDevice,
        deviceType: "Tv",
      } as Device;
  }
  return baseDevice;
}
