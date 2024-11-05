import { Text } from "react-native";
import { Container } from "../../components/ui/container";
import { RoomView } from "../../components/room/view";

export default function Home() {
  const roomName = "living";
  return (
    <Container>
      <Text>{roomName}</Text>
      <RoomView roomName={roomName}></RoomView>
    </Container>
  );
}
