import Device from "@/types/Device";

export function createDeviceDto(device: Device) {
  const dto = [
    device.deviceType,
    device.baseProperties.pin,
    device.baseProperties.state,
  ];
  const dtoFactory: { [key: string]: (device: Device) => void } = {
    Led: (device) => {
      dto.push(device.brightness);
    },
    Motor: (device) => {
      dto.push(device.speed);
    },
  };
  dtoFactory[device.deviceType]?.(device);
  return dto;
}
