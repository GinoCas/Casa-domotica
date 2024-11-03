import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
          <View
            style={{
              width: 25,
              height: 25,
              backgroundColor: "#0066ff",
              borderRadius: 7,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>4</Text>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
  connectedDevices: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  semibold: {
    fontWeight: "600",
  },
});
