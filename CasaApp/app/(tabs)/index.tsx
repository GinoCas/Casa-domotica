import { TimePickerTest } from "@/components/room/time-picker";
import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import bluetoothConnection from "@/lib/bluetoothLE";
import { GetRoomDevices } from "@/lib/roomController";
import useRoomStore from "@/stores/useRoomStore";
import useSpeechStore from "@/stores/useSpeechStore";
import { useEffect } from "react";
import { Text } from "react-native";

export default function Home() {
  const {
    roomName,
    changeLoadingDevices,
    devices,
    handleLoadDevices,
    isLoadingDevices,
  } = useRoomStore();
  const { results, voice, cmdVoice } = useSpeechStore();
  useEffect(() => {
    const getRoomDevices = async () => {
      if (roomName) {
        try {
          changeLoadingDevices(true);
          await bluetoothConnection.connectToDevice();
          const devices = GetRoomDevices(roomName);
          handleLoadDevices(devices);
        } catch (err) {
          console.log("Error on load devices", err);
        } finally {
          changeLoadingDevices(false);
        }
      }
    };
    getRoomDevices();
  }, [changeLoadingDevices, roomName, handleLoadDevices]);
  return (
    <Container>
      <TimePickerTest />
      <Text>Resultados: {results}</Text>
      <Text>{voice}</Text>
      <Text>{cmdVoice}</Text>
      <RoomView
        roomName={roomName}
        devices={devices}
        isLoadingDevices={isLoadingDevices}
      />
    </Container>
  );
}
