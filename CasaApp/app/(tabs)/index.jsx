import { Text } from "react-native";
import { Container } from "../../components/container";
import { RoomView } from "../../components/roomView";

export default function Home() {
  return (
    <Container>
      <Text>Living</Text>
      <RoomView roomName="/living"></RoomView>
    </Container>
  );
}
