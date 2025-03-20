import {
  getDeviceById,
  getDeviceList,
  updateDevice,
} from "@/lib/deviceController";
import { getRoomDevices } from "@/lib/roomController";
import Device from "@/types/Device";

function getRandomDevices(arr: Device[], n: number): Device[] {
  if (n > arr.length)
    throw new Error(
      "La cantidad de elementos solicitados supera el tamaño del array.",
    );
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function turnOnLedRandom() {
  try {
    const ledList = getDeviceList();
    const randomLeds = getRandomDevices(ledList, 3);
    ledList.forEach((device) => {
      const updatedDevice = device;
      updatedDevice.baseProperties.state = randomLeds.includes(device);
      updateDevice(device);
    });
  } catch {
    console.log("Error al activar el modo actividad");
    return;
  }
}

export function turnOnAllLedsOfRoom(roomName: string) {
  getRoomDevices(roomName).forEach((device) => {
    const updatedDevice = device;
    updatedDevice.baseProperties.state = true;
    updateDevice(updatedDevice);
  });
}

export function turnOffAllLedsOfRoom(roomName: string) {
  getRoomDevices(roomName).forEach((device) => {
    const updatedDevice = device;
    updatedDevice.baseProperties.state = false;
    updateDevice(device);
  });
}

export function toggleTv(state: boolean) {
  const tv = getDeviceById(6);
  tv.baseProperties.state = state;
  updateDevice(tv);
}
