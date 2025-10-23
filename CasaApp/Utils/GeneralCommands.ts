import useDeviceStore from "@/stores/useDeviceStore";
import useRoomStore from "@/stores/useRoomStore";
import { Device } from "@/src/core/entities/Device";
import { toggleDevices } from "@/src/services/DeviceActions";

export async function toggleAllDevices(state: boolean) {
  try {
    const { devices } = useDeviceStore.getState();
    const deviceList = Object.values(devices);

    if (deviceList.length === 0) {
      console.log("No hay dispositivos registrados");
      return;
    }

    const updates = deviceList.map((device: Device) => ({
      deviceId: device.id,
      newState: state,
    }));
    await toggleDevices(updates);
  } catch (err) {
    console.log("Error al cambiar el estado de todos los dispositivos", err);
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

    const updates = targetDevices.map((device) => ({
      deviceId: device.id,
      newState: true,
    }));
    if (updates.length > 0) await toggleDevices(updates);
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

    const updates = targetDevices.map((device) => ({
      deviceId: device.id,
      newState: false,
    }));
    if (updates.length > 0) await toggleDevices(updates);
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
    await toggleDevices([{ deviceId: tv.id, newState: state }]);
  } catch (err) {
    console.log("Error al cambiar el estado de la TV", err);
  }
}
