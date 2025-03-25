import { Device, Illuminable, Rotatable } from "@/types/Device";

export function createDeviceDto(device: Device) {
  const dto = [device.type, device.pin, device.state];
  if ("brightness" in device) {
    dto.push((device as Illuminable).brightness);
  }
  if ("speed" in device) {
    dto.push((device as Rotatable).speed);
  }
  return dto;
}
