import { useEffect, useState } from "react";
import useDeviceStore from "@/stores/useDeviceStore";
import { deviceService } from "@/src/services/DeviceService";
import { Device } from "@/src/core/entities/Device";
import useRoomStore from "@/stores/useRoomStore";

export default function useDevices() {
  const [roomDevices, setRoomDevices] = useState<Device[]>([]);
  const [loadingRoomDevices, setLoadingRoomDevices] = useState<boolean>(false);
  const [unassignedDevices, setUnassignedDevices] = useState<Device[]>([]);

  const { currentRoom, rooms } = useRoomStore();

  const { devices, handleLoadDevices } = useDeviceStore();

  useEffect(() => {
    const loadDevices = async () => {
      const devicesResult = await deviceService.getDeviceList();
      if (!devicesResult.isSuccess) {
        console.log("Error on loading devices", devicesResult.errors);
        return;
      }
      handleLoadDevices(devicesResult.data);
    };
    loadDevices();
  }, [handleLoadDevices]);

  useEffect(() => {
    const allDeviceIdsInRooms = rooms.flatMap((room) => room.deviceIds);
    const unassigned = devices.filter(
      (device) => !allDeviceIdsInRooms.includes(device.id),
    );
    setUnassignedDevices(unassigned);
  }, [devices, rooms]);

  useEffect(() => {
    setLoadingRoomDevices(true);
    if (currentRoom?.name === "Todas") {
      setRoomDevices(devices);
    } else {
      setRoomDevices(
        devices.filter((d) => currentRoom?.deviceIds.includes(d.id)),
      );
    }
    setLoadingRoomDevices(false);
  }, [currentRoom, devices]);

  const updateDevice = async (
    deviceId: number,
    name: string,
    description: string,
  ) => {
    const result = await deviceService.updateDevice(deviceId, name, description);
    if (!result.isSuccess) {
      console.log("Error on updating device", result.errors);
      return;
    }
    const devicesResult = await deviceService.getDeviceList();
    if (!devicesResult.isSuccess) {
      console.log("Error on loading devices", devicesResult.errors);
      return;
    }
    handleLoadDevices(devicesResult.data);
  };

  const addDeviceToRoom = async (roomId: number, deviceId: number) => {
    const result = await deviceService.addDeviceToRoom(roomId, deviceId);
    if (!result.isSuccess) {
      console.log("Error on adding device to room", result.errors);
      return;
    }
    const devicesResult = await deviceService.getDeviceList();
    if (!devicesResult.isSuccess) {
      console.log("Error on loading devices", devicesResult.errors);
      return;
    }
    handleLoadDevices(devicesResult.data);
  };

  return {
    roomDevices,
    loadingRoomDevices,
    unassignedDevices,
    updateDevice,
    addDeviceToRoom,
  };
}
