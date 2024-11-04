import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Chip } from "../../components/chip";
import { DeviceCard } from "../../components/deviceCard";

{
  /* TODO: Aca se deberia usar el componente FlatList: https://reactnative.dev/docs/using-a-listview:
   * Dato: SectionList tambien podria ser util en caso de serparlo por tipo de dispositivo (led, cooler, etc)
   * Checkear si al utilizar FlatList el scroll vertical es automatico
   */
}

export default function RoomView() {
  const { room_name } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <Text>{room_name}</Text>
      <View>
        <View style={styles.connectedDevices}>
          <Text style={styles.semibold}>Connected Devices</Text>
          <Chip text="5" />
        </View>
        <View style={styles.connectedDevices}>
          {Array.from({ length: 5 }).map((_, i) => (
            <DeviceCard key={i} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  connectedDevices: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
