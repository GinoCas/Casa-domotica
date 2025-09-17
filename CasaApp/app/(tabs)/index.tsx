import { TimePickerTest } from "@/components/room/time-picker";
import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import { Device } from "@/src/core/entities/Device";
import { deviceService } from "@/src/services/DeviceService";
import useDeviceStore from "@/stores/useDeviceStore";
import useRoomStore from "@/stores/useRoomStore";
import useSpeechStore from "@/stores/useSpeechStore";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function Home() {
  const { currentRoom /* , changeCurrentRoom  */ } = useRoomStore();
  const { devices, handleLoadDevices /* , syncChanges */ } = useDeviceStore();
  const [roomDevices, setRoomDevices] = useState<Device[]>([]);
  const [loadingRoomDevices, setLoadingRoomDevices] = useState<boolean>(false);

  const { results, voice, cmdVoice } = useSpeechStore();

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

  /* 
  TODO: Revisar caso de uso y si es posible buscar una mejor estrategia
  useEffect(() => {
    const syncInterval = setInterval(() => {
      syncChanges();
    }, 10000);

    return () => clearInterval(syncInterval);
  }, [syncChanges]); */

  return (
    <Container>
      <TimePickerTest />
      <Text>Resultados: {results}</Text>
      <Text>{voice}</Text>
      <Text>{cmdVoice}</Text>
      <RoomView devices={roomDevices} loadingRoomDevices={loadingRoomDevices} />
    </Container>
  );
}
