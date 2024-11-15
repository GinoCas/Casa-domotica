import Device from "@/types/Device";
import DevicesData from "@/stores/devices.json";
import { createDeviceDto } from "@/Utils/DeviceDtoFactory";
import bluetoothConnection from "./bluetoothLE";
import useModeStore from "@/stores/useModeStore";

export function GetDeviceList(): Device[] {
  return DevicesData as Device[];
}

export function GetDeviceById(id: number): Device {
  const deviceIndex = DevicesData.findIndex(
    (device) => device.baseProperties.id === id
  );
  return DevicesData[deviceIndex] as Device;
}

export async function UpdateDevice(updatedDevice: Device) {
  const { saveEnergyMode } = useModeStore.getState();
  const deviceIndex = DevicesData.findIndex(
    (device) => device.baseProperties.id === updatedDevice.baseProperties.id
  );
  DevicesData[deviceIndex] = {
    ...DevicesData[deviceIndex],
    ...updatedDevice,
    baseProperties: {
      ...DevicesData[deviceIndex].baseProperties,
      ...updatedDevice.baseProperties,
    },
  };
  let device: Device = DevicesData[deviceIndex] as Device;
  if (device.deviceType === "Led" && saveEnergyMode) {
    device.brightness = 75;
  }
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

export function GetLedList() {
  const list: Device[] = [];
  GetDeviceList().forEach((device) => {
    if (device.deviceType === "Led") {
      list.push(device);
    }
  });
  return list;
}

export async function UpdateAllLeds() {
  GetDeviceList().forEach(async (device) => {
    if (device.deviceType === "Led") {
      await UpdateDevice(device);
    }
  });
  return;
}
