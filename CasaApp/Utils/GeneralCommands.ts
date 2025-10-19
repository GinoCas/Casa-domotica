import useDeviceStore from "@/stores/useDeviceStore";
import useRoomStore from "@/stores/useRoomStore";
import { Device } from "@/src/core/entities/Device";
import { toggleDevice } from "@/src/services/DeviceActions";

function getRandomDevices(arr: Device[], n: number): Device[] {
  if (n > arr.length)
    throw new Error(
      "La cantidad de elementos solicitados supera el tamaño del array.",
    );
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export async function turnOnLedRandom() {
  try {
    const { devices } = useDeviceStore.getState();
    const deviceList = Object.values(devices);
    const leds = deviceList.filter((d) => d.deviceType === "Led");
    const randomDevices = getRandomDevices(leds, Math.min(3, leds.length));

    await Promise.all(
      randomDevices.map((device) => toggleDevice(device.id, true)),
    );
  } catch (err) {
    console.log("Error al activar el modo actividad", err);
  }
}

export async function turnOnAllLedsOfRoom(roomName: string) {
  const { devices } = useDeviceStore.getState();
  const deviceList = Object.values(devices);
  const { getRoomByName } = useRoomStore.getState();

  try {
    let targetDevices: Device[] = [];

    if (roomName.toLowerCase() === "todas") {
      targetDevices = deviceList.filter((d) => d.deviceType === "Led");
    } else {
      const roomResult = getRoomByName(roomName);
      if (!roomResult.isSuccess) {
        console.log("Habitación no encontrada:", roomResult.errors.join(", "));
        return;
      }
      const targetIds = roomResult.data.deviceIds;
      targetDevices = deviceList.filter(
        (d) => d.deviceType === "Led" && targetIds.includes(d.id),
      );
    }

    for (const device of targetDevices) {
      await toggleDevice(device.id, true);
    }
  } catch (err) {
    console.log("Error al encender las luces de la habitación", err);
  }
}

export async function turnOffAllLedsOfRoom(roomName: string) {
  const { devices } = useDeviceStore.getState();
  const deviceList = Object.values(devices);
  const { getRoomByName } = useRoomStore.getState();

  try {
    let targetDevices: Device[] = [];

    if (roomName.toLowerCase() === "todas") {
      targetDevices = deviceList.filter((d) => d.deviceType === "Led");
    } else {
      const roomResult = getRoomByName(roomName);
      if (!roomResult.isSuccess) {
        console.log("Habitación no encontrada:", roomResult.errors.join(", "));
        return;
      }
      const targetIds = roomResult.data.deviceIds;
      targetDevices = deviceList.filter(
        (d) => d.deviceType === "Led" && targetIds.includes(d.id),
      );
    }

    for (const device of targetDevices) {
      await toggleDevice(device.id, false);
    }
  } catch (err) {
    console.log("Error al apagar las luces de la habitación", err);
  }
}

export async function toggleTv(state: boolean) {
  try {
    const { devices } = useDeviceStore.getState();
    const deviceList = Object.values(devices);
    const tv = deviceList.find((d) => d.deviceType === "Tv");
    if (!tv) {
      console.log("No se encontró un dispositivo de TV registrado");
      return;
    }
    await toggleDevice(tv.id, state);
  } catch (err) {
    console.log("Error al cambiar el estado de la TV", err);
  }
}
