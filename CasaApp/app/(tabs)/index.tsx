import { TimePickerTest } from "@/components/room/time-picker";
import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import { deviceService } from "@/src/services/DeviceService";
import { roomService } from "@/src/services/RoomService";
import useDeviceStore from "@/stores/useDeviceStore";
import useRoomStore from "@/stores/useRoomStore";
import useSpeechStore from "@/stores/useSpeechStore";
import { useEffect } from "react";
import { Text } from "react-native";

export default function Home() {
  const {
    roomName,
    changeLoadingRoomDevices,
    roomDevices,
    handleLoadRoomDevices,
    isLoadingRoomDevices,
  } = useRoomStore();

  const { devices, handleLoadDevices, syncChanges } = useDeviceStore();

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
    const getDevicesOfRoom = async () => {
      changeLoadingRoomDevices(true);
      if (!roomName) {
        changeLoadingRoomDevices(false);
        return;
      }
      if (roomName === "Todas") {
        handleLoadRoomDevices(devices);
        changeLoadingRoomDevices(false);
        return;
      }
      const devIds = await roomService.getDevicesByRoomName(roomName);
      if (!devIds.isSuccess) {
        handleLoadRoomDevices([]);
        changeLoadingRoomDevices(false);
        return;
      }
      const currentDevices = devices.filter((d) => devIds.data.includes(d.id));
      handleLoadRoomDevices(currentDevices);
      changeLoadingRoomDevices(false);
    };
    getDevicesOfRoom();
  }, [changeLoadingRoomDevices, roomName, handleLoadRoomDevices, devices]);

  useEffect(() => {
    const syncInterval = setInterval(() => {
      syncChanges();
    }, 10000);

    return () => clearInterval(syncInterval);
  }, [syncChanges]);

  return (
    <Container>
      <TimePickerTest />
      <Text>Resultados: {results}</Text>
      <Text>{voice}</Text>
      <Text>{cmdVoice}</Text>
      <RoomView
        roomName={roomName}
        devices={roomDevices}
        isLoadingDevices={isLoadingRoomDevices}
      />
    </Container>
  );
}
