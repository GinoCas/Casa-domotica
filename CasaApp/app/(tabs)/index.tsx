import { TimePickerTest } from "@/components/room/time-picker";
import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import { deviceService } from "@/services/deviceService";
import { roomService } from "@/services/roomService";
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

  const {
    devices,
    handleLoadDevices,
    syncChanges,
  } = useDeviceStore();

  const { results, voice, cmdVoice } = useSpeechStore();

  useEffect(() => {
    const loadDevices = async () => {
      const dev = (await deviceService.getDeviceList());
      if (!dev.isSuccess)
      {
        console.log("Error on loading devices", dev.errors);
        return
      }
      handleLoadDevices(dev.data);
    }
    loadDevices();
  }, [handleLoadDevices]);

  useEffect(() => {
    const getDevicesOfRoom = async () => {
      changeLoadingRoomDevices(true);
      if (!roomName) {
        changeLoadingRoomDevices(false);
        return;
      }
      if(roomName == "Todas"){
        handleLoadRoomDevices(devices);
        changeLoadingRoomDevices(false);
        return;
      }
      let dev = await roomService.getRoomDevices(roomName);
      if(!dev.isSuccess){
        changeLoadingRoomDevices(false);
        return;
      }
      handleLoadRoomDevices(dev.data);
      changeLoadingRoomDevices(false);
    };
    getDevicesOfRoom();
  }, [changeLoadingRoomDevices, roomName, handleLoadRoomDevices]);

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
