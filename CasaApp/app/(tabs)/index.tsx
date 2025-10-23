import { Text } from "react-native";
import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import useDevices from "@/hooks/useDevices";
import GlobalStyles from "@/Utils/globalStyles";

export default function Home() {
  const { roomDevicesMemo, isLoadingDevices, unassignedDevices } = useDevices();

  return (
    <Container>
      {/* <Text style={GlobalStyles.semibold}>Welcome!</Text> */}
      <RoomView
        devices={roomDevicesMemo}
        loadingRoomDevices={isLoadingDevices}
        unassignedDevices={unassignedDevices}
      />
    </Container>
  );
}
