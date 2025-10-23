import { Text } from "react-native";
import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import useDevices from "@/hooks/useDevices";
import GlobalStyles from "@/Utils/globalStyles";

export default function Home() {
  const { roomDevicesMemo, isLoadingDevices, unassignedDevices } = useDevices();

  return (
    <Container>
      <Text
        style={{
          fontSize: 26,
          fontWeight: 600,
          textAlign: "center",
          marginBottom: 5,
        }}
      >
        Encedé<Text style={{ color: GlobalStyles.disabledColor }}>.</Text>
        <Text style={{ color: "#f1c40f" }}>me</Text>
      </Text>
      <Text style={{ textAlign: "center", marginVertical: 4 }}>
        Encendé tu casa, estés donde estés.
      </Text>
      <RoomView
        devices={roomDevicesMemo}
        loadingRoomDevices={isLoadingDevices}
        unassignedDevices={unassignedDevices}
      />
    </Container>
  );
}
