import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Chip } from "./components/chip";
import { DeviceCard } from "./components/deviceCard";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>Living Room</Text>
          <Text>Profile</Text>
        </View>
        <View style={styles.connectedDevices}>
          <Text style={styles.semibold}>Connected Devices</Text>
          <Chip text="5" />
        </View>
        <View style={styles.connectedDevices}>
          <DeviceCard />
          <DeviceCard />
          <DeviceCard />
          <DeviceCard />
          <DeviceCard />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  connectedDevices: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fff",
    gap: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
});
