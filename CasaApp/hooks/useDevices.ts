import { useEffect, useState } from "react";
import useDeviceStore from "@/stores/useDeviceStore";
import { deviceService } from "@/src/services/DeviceService";
import { Device } from "@/src/core/entities/Device";
import useRoomStore from "@/stores/useRoomStore";

export default function useDevices() {
  const [roomDevices, setRoomDevices] = useState<Device[]>([]);
  const [loadingRoomDevices, setLoadingRoomDevices] = useState<boolean>(false);

  const { currentRoom } = useRoomStore();

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

  return { roomDevices, loadingRoomDevices };
}
