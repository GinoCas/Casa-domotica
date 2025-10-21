import { Text } from "react-native";
import { TimePickerTest } from "@/components/room/time-picker";
import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import useDevices from "@/hooks/useDevices";
import useSpeechStore from "@/stores/useSpeechStore";

export default function Home() {
  const { results, voice, cmdVoice } = useSpeechStore();
  const { roomDevicesMemo, isLoadingDevices, unassignedDevices } = useDevices();

  return (
    <Container>
      <TimePickerTest />
      <Text>Resultados: {results}</Text>
      <Text>{voice}</Text>
      <Text>{cmdVoice}</Text>
      <RoomView
        devices={roomDevicesMemo}
        loadingRoomDevices={isLoadingDevices}
        unassignedDevices={unassignedDevices}
      />
    </Container>
  );
}
