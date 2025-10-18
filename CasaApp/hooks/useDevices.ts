import { useEffect, useRef, useState } from "react";
import useDeviceStore from "@/stores/useDeviceStore";
import { deviceService } from "@/src/services/DeviceService";
import { Device } from "@/src/core/entities/Device";
import useRoomStore from "@/stores/useRoomStore";
import useModeStore from "@/stores/useModeStore";

export default function useDevices() {
  const [roomDevices, setRoomDevices] = useState<Device[]>([]);
  const [loadingRoomDevices, setLoadingRoomDevices] = useState<boolean>(false);
  const [unassignedDevices, setUnassignedDevices] = useState<Device[]>([]);

  const { currentRoom, rooms } = useRoomStore();

  const { devices, handleLoadDevices, changeLoadingDevices, refreshDevices } =
    useDeviceStore();
  const { activityMode } = useModeStore();

  const wasActiveRef = useRef<boolean>(false);

  useEffect(() => {
    const loadDevices = async () => {
      changeLoadingDevices(true);
      const devicesResult = await deviceService.getDeviceList();
      if (!devicesResult.isSuccess) {
        console.log("Error on loading devices", devicesResult.errors);
        changeLoadingDevices(false);
        return;
      }
      handleLoadDevices(devicesResult.data);
      changeLoadingDevices(false);
    };
    loadDevices();
  }, [handleLoadDevices, changeLoadingDevices]);

  // Polling condicionado por modo actividad: solo activo y cada 5s
  useEffect(() => {
    if (!activityMode) return;

    const interval = setInterval(async () => {
      const devicesResult = await deviceService.getDeviceList();
      if (devicesResult.isSuccess) {
        handleLoadDevices(devicesResult.data);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [handleLoadDevices, activityMode]);

  // Al desactivar modo actividad: esperar 2s y refrescar desde backend
  useEffect(() => {
    if (!activityMode && wasActiveRef.current) {
      changeLoadingDevices(true); // Mostrar loader mientras esperamos
      const timeout = setTimeout(async () => {
        await refreshDevices(); // Refrescar estados ya propagados al backend
      }, 2000);
      wasActiveRef.current = false;
      return () => {
        clearTimeout(timeout);
        changeLoadingDevices(false);
      };
    }
    if (activityMode) {
      wasActiveRef.current = true;
    }
  }, [activityMode, refreshDevices, changeLoadingDevices]);

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

  return {
    roomDevices,
    loadingRoomDevices,
    unassignedDevices,
  };
}
