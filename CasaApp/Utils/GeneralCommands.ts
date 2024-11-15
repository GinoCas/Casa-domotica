import {
  GetDeviceList,
  GetLedList,
  UpdateDevice,
} from "@/lib/deviceController";
import { GetRoomDevices } from "@/lib/roomController";
import Device from "@/types/Device";

function getRandomDevices(arr: Device[], n: number): Device[] {
  if (n > arr.length)
    throw new Error(
      "La cantidad de elementos solicitados supera el tamaño del array.",
    );
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function TurnOnLedRandom() {
  try {
    const ledList = GetDeviceList();
    const randomLeds = getRandomDevices(ledList, 3);
    ledList.forEach((device) => {
      const updatedDevice = device;
      updatedDevice.baseProperties.state = randomLeds.includes(device);
      UpdateDevice(device);
    });
  } catch {
    console.log("Error al activar el modo actividad");
    return;
  }
}

export function TurnOnAllLedsOfRoom(roomName: string) {
  GetRoomDevices(roomName).forEach((device) => {
    const updatedDevice = device;
    updatedDevice.baseProperties.state = true;
    UpdateDevice(updatedDevice);
  });
}

export function TurnOffAllLedsOfRoom(roomName: string) {
  GetRoomDevices(roomName).forEach((device) => {
    const updatedDevice = device;
    updatedDevice.baseProperties.state = false;
    UpdateDevice(device);
  });
}
