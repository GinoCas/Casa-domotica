import { Container } from "@/components/ui/container";
import { RoomView } from "@/components/room/view";
import useRoomStore from "@/stores/useRoomStore";

export default function Home() {
  const { roomName, devices } = useRoomStore();
  return (
    <Container>
      <RoomView roomName={roomName} devices={devices} />
    </Container>
  );
}
