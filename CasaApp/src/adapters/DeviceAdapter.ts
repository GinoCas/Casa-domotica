import { DeviceWithState } from "@/stores/useDeviceStore";
import { Device as DeviceLegacy } from "@/types/Device";

export function toLegacyDevice(devices: DeviceWithState[]): DeviceLegacy[] {
  return devices.map((d) => ({
    id: d.device.id,
    deviceType: d.device.type,
    state: d.state || false,
    voltage: 0,
    amperes: 0,
    brightness: d.brightness,
    speed: d.speed,
  }));
}
