import { useEffect, useMemo } from "react";
import useDeviceStore from "@/stores/useDeviceStore";
import { deviceService } from "@/src/services/DeviceService";
import useRoomStore from "@/stores/useRoomStore";
import { mergeDevices } from "@/src/services/DeviceActions";
import { parseTimeToISO8601String } from "@/Utils/parseTimeString";

export default function useDevices() {
  const { currentRoom, rooms } = useRoomStore();
  const devices = useDeviceStore((state) => state.devices);
  const isLoadingDevices = useDeviceStore((state) => state.isLoadingDevices);
  const handleLoadDevices = useDeviceStore((state) => state.handleLoadDevices);
  const changeLoadingDevices = useDeviceStore(
    (state) => state.changeLoadingDevices,
  );

  // Memoizar la conversión de objeto a array solo cuando devices cambie
  const deviceList = useMemo(() => Object.values(devices), [devices]);

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
  }, []);

  useEffect(() => {
    const intervalMs = 2500;
    const interval = setInterval(async () => {
      const baseline = useDeviceStore.getState().lastModified;
      const result = await deviceService.getDevicesModifiedAfter(
        parseTimeToISO8601String(baseline),
      );
      if (result.isSuccess && result.data.length) {
        mergeDevices(result.data);
        useDeviceStore.getState().setLastModified(new Date());
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, []);

  const roomDevicesMemo = useMemo(() => {
    if (currentRoom?.name === "Todas") {
      return deviceList;
    } else {
      return deviceList.filter((d) => currentRoom?.deviceIds.includes(d.id));
    }
  }, [currentRoom, deviceList]);

  const unassignedDevices = useMemo(() => {
    const allDeviceIdsInRooms = rooms.flatMap((room) => room.deviceIds);
    return deviceList.filter(
      (device) => !allDeviceIdsInRooms.includes(device.id),
    );
  }, [deviceList, rooms]);

  return {
    roomDevicesMemo,
    deviceList,
    isLoadingDevices,
    unassignedDevices,
  };
}
