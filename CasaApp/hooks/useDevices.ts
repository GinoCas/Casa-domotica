import { useEffect, useMemo, useRef, useState } from "react";
import useDeviceStore from "@/stores/useDeviceStore";
import { deviceService } from "@/src/services/DeviceService";
import useRoomStore from "@/stores/useRoomStore";
import useModeStore from "@/stores/useModeStore";
import { modeService } from "@/src/services/ModeService";
import { refreshDevices as refreshDevicesAction } from "@/src/services/DeviceActions";
import { Device } from "@/src/core/entities/Device";

export default function useDevices() {
  const [roomDevices, setRoomDevices] = useState<Device[]>([]);
  const [unassignedDevices, setUnassignedDevices] = useState<Device[]>([]);
  const [loadingRoomDevices, setLoadingRoomDevices] = useState(true);

  const { currentRoom, rooms } = useRoomStore();

  // Optimización: usar selectores específicos para evitar re-renders innecesarios
  const devices = useDeviceStore((state) => state.devices);
  const handleLoadDevices = useDeviceStore((state) => state.handleLoadDevices);
  const changeLoadingDevices = useDeviceStore((state) => state.changeLoadingDevices);
  
  // Memoizar la conversión de objeto a array solo cuando devices cambie
  const deviceList = useMemo(() => Object.values(devices), [devices]);
  
  const { activityMode } = useModeStore();

  const wasActiveRef = useRef<boolean>(false);
  const activityDisabledAtRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (activityMode) return; // Evitar doble polling si está en modo actividad

    const interval = setInterval(async () => {
      const devicesResult = await deviceService.getDeviceList();
      if (devicesResult.isSuccess) {
        handleLoadDevices(devicesResult.data);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [activityMode, handleLoadDevices]);

  // Al desactivar modo actividad: esperar hasta que lastChanged cambie y refrescar
  useEffect(() => {
    if (!activityMode && wasActiveRef.current) {
      changeLoadingDevices(true); // Mostrar loader mientras esperamos
      activityDisabledAtRef.current = Date.now();
      let stopped = false;

      const interval = setInterval(async () => {
        if (stopped) return;
        const modesResult = await modeService.getModes();
        if (modesResult.isSuccess) {
          const activity = modesResult.data.find((m) => m.name === "Activity");
          if (activity) {
            const lastTs = new Date(activity.lastChanged).getTime();
            const disabledTs = activityDisabledAtRef.current ?? 0;
            if (!Number.isNaN(lastTs) && lastTs >= disabledTs) {
              await refreshDevicesAction(); // Refrescar estados ya propagados al backend
              clearInterval(interval);
              changeLoadingDevices(false);
              stopped = true;
            }
          }
        }
      }, 1000);

      const timeout = setTimeout(async () => {
        if (!stopped) {
          clearInterval(interval);
          await refreshDevicesAction();
          changeLoadingDevices(false);
          stopped = true;
        }
      }, 10000);

      wasActiveRef.current = false;
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
        changeLoadingDevices(false);
      };
    }
    if (activityMode) {
      wasActiveRef.current = true;
    }
  }, [activityMode, changeLoadingDevices]);

  // Optimización: memoizar el cálculo de dispositivos no asignados
  const unassignedDevicesMemo = useMemo(() => {
    const allDeviceIdsInRooms = rooms.flatMap((room) => room.deviceIds);
    return deviceList.filter(
      (device) => !allDeviceIdsInRooms.includes(device.id),
    );
  }, [deviceList, rooms]);

  useEffect(() => {
    setUnassignedDevices(unassignedDevicesMemo);
  }, [unassignedDevicesMemo]);

  // Optimización: memoizar el cálculo de dispositivos de la habitación
  const roomDevicesMemo = useMemo(() => {
    if (currentRoom?.name === "Todas") {
      return deviceList;
    } else {
      return deviceList.filter((d) => currentRoom?.deviceIds.includes(d.id));
    }
  }, [currentRoom, deviceList]);

  useEffect(() => {
    setLoadingRoomDevices(true);
    setRoomDevices(roomDevicesMemo);
    setLoadingRoomDevices(false);
  }, [roomDevicesMemo]);

  return {
    roomDevices,
    loadingRoomDevices,
    unassignedDevices,
  };
}
