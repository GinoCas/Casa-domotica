import { TimePickerTest } from "@/components/room/time-picker";
import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import SpeechToText from "@/components/ui/speechToText";
import bluetoothConnection from "@/lib/bluetoothLE";
import { GetRoomDevices } from "@/lib/roomController";
import useRoomStore from "@/stores/useRoomStore";
import { useEffect } from "react";

export default function Home() {
  const {
    roomName,
    changeLoadingDevices,
    devices,
    handleLoadDevices,
    isLoadingDevices,
  } = useRoomStore();
  useEffect(() => {
    const getRoomDevices = async () => {
      if (roomName) {
        try {
          changeLoadingDevices(true);
          await bluetoothConnection.connectToDevice();
        } catch (err) {
          console.log("Error on load devices", err);
        } finally {
          const devices = GetRoomDevices(roomName);
          handleLoadDevices(devices);
          changeLoadingDevices(false);
        }
      }
    };
    getRoomDevices();
  }, [changeLoadingDevices, roomName, handleLoadDevices]);
  return (
    <Container>
      <TimePickerTest />
      <SpeechToText />
      <RoomView
        roomName={roomName}
        devices={devices}
        isLoadingDevices={isLoadingDevices}
      />
    </Container>
  );
}
