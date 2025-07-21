import { TimePickerTest } from "@/components/room/time-picker";
import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import { getDeviceList } from "@/lib/deviceController";
import { getRoomDevices } from "@/lib/roomController";
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
      try {
        const devices = await getDeviceList();
        handleLoadDevices(devices.data);
      } catch (err) {
        console.log("Error on loading devices", err);
      }
    }
    loadDevices();
  }, [handleLoadDevices, devices, getDeviceList]);

  useEffect(() => {
    const syncInterval = setInterval(() => {
      syncChanges();
    }, 10000);
    
    return () => clearInterval(syncInterval);
  }, [syncChanges]);

  useEffect(() => {
    const getDevicesOfRoom = async () => {
      if (roomName) {
        try {
          changeLoadingRoomDevices(true);
          const devices = await getRoomDevices(roomName);
          handleLoadRoomDevices(devices.data);
        } catch (err) {
          console.log("Error on loading room devices", err);
        } finally {
          changeLoadingRoomDevices(false);
        }
      }
    };
    getDevicesOfRoom();
  }, [changeLoadingRoomDevices, roomName, handleLoadRoomDevices]);
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
