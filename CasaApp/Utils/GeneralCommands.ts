import { getRoomDevices } from "@/lib/roomController";
import useDeviceStore from "@/stores/useDeviceStore";
import { Device } from "@/types/Device";

//const { devices, toggleDeviceState } = useDeviceStore();

function getRandomDevices(arr: Device[], n: number): Device[] {
  if (n > arr.length)
    throw new Error(
      "La cantidad de elementos solicitados supera el tamaño del array.",
    );
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export async function turnOnLedRandom() {
  /*try {
    const devicesList = devices;
    const randomDevices = getRandomDevices(devices, 3);
    devicesList.forEach((device) => {
      const newState = randomDevices.includes(device);
      toggleDeviceState(device.id, newState);
    });
  } catch {
    console.log("Error al activar el modo actividad");
    return;
  }*/
}

export async function turnOnAllLedsOfRoom(roomName: string) {
  /*(await getRoomDevices(roomName)).data.forEach((device) => {
    toggleDeviceState(device.id, true);
  });*/
}

export async function turnOffAllLedsOfRoom(roomName: string) {
  /*(await getRoomDevices(roomName)).data.forEach((device) => {
    toggleDeviceState(device.id, false);
  });*/
}

export function toggleTv(state: boolean) {
  //toggleDeviceState(6, state);
}
