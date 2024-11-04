import { View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function RoomView() {
  const { room_name } = useLocalSearchParams();
  return (
    <View>
      <Text>Hola</Text>
    </View>
  );
}
