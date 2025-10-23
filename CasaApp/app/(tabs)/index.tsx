import { Text } from "react-native";
import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import useDevices from "@/hooks/useDevices";

export default function Home() {
  const { roomDevicesMemo, isLoadingDevices, unassignedDevices } = useDevices();

  return (
    <Container>
      <Text
        style={{
          fontSize: 26,
          fontWeight: 600,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        ¡Bienvenido!
      </Text>
      <RoomView
        devices={roomDevicesMemo}
        loadingRoomDevices={isLoadingDevices}
        unassignedDevices={unassignedDevices}
      />
    </Container>
  );
}
