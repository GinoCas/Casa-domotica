import { TimePickerTest } from "@/components/room/time-picker";
import { RoomView } from "@/components/room/view";
import { Container } from "@/components/ui/container";
import useDevices from "@/hooks/useDevices";
import useSpeechStore from "@/stores/useSpeechStore";
import { Text } from "react-native";

export default function Home() {
  const { results, voice, cmdVoice } = useSpeechStore();
  const { roomDevices, loadingRoomDevices, unassignedDevices } = useDevices();

  return (
    <Container>
      <TimePickerTest />
      <Text>Resultados: {results}</Text>
      <Text>{voice}</Text>
      <Text>{cmdVoice}</Text>
      <RoomView
        devices={roomDevices}
        loadingRoomDevices={loadingRoomDevices}
        unassignedDevices={unassignedDevices}
      />
    </Container>
  );
}
