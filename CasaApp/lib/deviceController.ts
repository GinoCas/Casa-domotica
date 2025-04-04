import { Device, Illuminable } from "@/types/Device";
import DevicesData from "@/stores/devices.json";
import { createDeviceDto } from "@/Utils/DeviceDtoFactory";
import bluetoothConnection from "./bluetoothLE";
import useModeStore from "@/stores/useModeStore";

export function getDeviceList(): Device[] {
  return DevicesData as Device[];
}

export function getDeviceById(id: number): Device {
  const deviceIndex = DevicesData.findIndex((device) => device.id === id);
  return DevicesData[deviceIndex] as Device;
}

export async function updateDevice(updatedDevice: Device) {
  const { saveEnergyMode } = useModeStore.getState();
  const deviceIndex = DevicesData.findIndex(
    (device) => device.id === updatedDevice.id,
  );
  DevicesData[deviceIndex] = {
    ...DevicesData[deviceIndex],
    ...updatedDevice,
  };

  let device: Device = DevicesData[deviceIndex] as Device;
  if (device.type === "led" && saveEnergyMode) {
    (device as Illuminable).brightness = 75;
  }

  const dto = createDeviceDto(DevicesData[deviceIndex] as Device);
  await bluetoothConnection.sendData(dto);
  return;
}

export async function UpdateAllDevices() {
  getDeviceList().forEach(async (device) => {
    await updateDevice(device);
  });
  return;
}

export function GetLedList() {
  const list: Device[] = [];
  getDeviceList().forEach((device) => {
    if (device.deviceType === "Led" || device.deviceType === "Tv") {
      list.push(device);
    }
  });
  return list;
}

export async function UpdateAllLeds() {
  getDeviceList().forEach(async (device) => {
    if (device.deviceType === "Led" || device.deviceType === "Tv") {
      await updateDevice(device);
    }
  });
  return;
}
