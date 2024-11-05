import { Text } from "react-native";
import { Container } from "../../components/ui/container";
import { RoomView } from "../../components/room/view";
import { GetDeviceList } from "../../lib/deviceController";
import { useEffect, useState } from "react";

export default function Home() {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    GetDeviceList().then((devices) => {
      console.log("x");
      console.log(devices);
      setDevices(devices);
    });
  }, []);
  const roomName = "living";
  return (
    <Container>
      <Text>{roomName}</Text>
      <RoomView roomName={roomName}></RoomView>
    </Container>
  );
}
