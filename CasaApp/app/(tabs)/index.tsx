import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import { GetDeviceList } from "@/lib/deviceController";
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
      changeLoadingDevices(true);
      if (roomName) {
        try {
          const deviceResult = await GetDeviceList(roomName);
          handleLoadDevices(deviceResult.data[0].Devices);
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
      <RoomView
        roomName={roomName}
        devices={devices}
        isLoadingDevices={isLoadingDevices}
      />
    </Container>
  );
}
