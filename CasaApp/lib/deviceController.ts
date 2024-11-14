import Device from "@/types/Device";
import DevicesData from "@/stores/devices.json";
import { createDeviceDto } from "@/Utils/DeviceDtoFactory";
import bluetoothConnection from "./bluetoothLE";

export function GetDeviceList(): Device[] {
  return DevicesData as Device[];
}

export function GetDeviceById(id: number): Device {
  const deviceIndex = DevicesData.findIndex(
    (device) => device.baseProperties.id === id,
  );
  return DevicesData[deviceIndex] as Device;
}

export async function UpdateDevice(updatedDevice: Device) {
  const deviceIndex = DevicesData.findIndex(
    (device) => device.baseProperties.id === updatedDevice.baseProperties.id,
  );
  DevicesData[deviceIndex] = {
    ...DevicesData[deviceIndex],
    ...updatedDevice,
    baseProperties: {
      ...DevicesData[deviceIndex].baseProperties,
      ...updatedDevice.baseProperties,
    },
  };
  const dto = createDeviceDto(DevicesData[deviceIndex] as Device);
  await bluetoothConnection.sendData(dto);
  return;
}

export async function UpdateAllDevices() {
  GetDeviceList().forEach(async (device) => {
    await UpdateDevice(device);
  });
  return;
}
