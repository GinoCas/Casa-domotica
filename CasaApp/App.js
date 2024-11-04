import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Chip } from "./components/chip";
import { DeviceCard } from "./components/deviceCard";
import Constants from "expo-constants";

export default function App() {
  return (
    <View>
      <Text>Test</Text>
    </View>
    /*<View>
      <View style={styles.connectedDevices}>
        <Text style={styles.semibold}>Connected Devices</Text>
        <Chip text="5" />
      </View>
      {/* TODO: Aca se deberia usar el componente FlatList: https://reactnative.dev/docs/using-a-listview:
       * Dato: SectionList tambien podria ser util en caso de serparlo por tipo de dispositivo (led, cooler, etc)
       * Checkear si al utilizar FlatList el scroll vertical es automatico
       *}
      <View style={styles.connectedDevices}>
        {Array.from({ length: 5 }).map((_, i) => (
          <DeviceCard key={i} />
        ))}
      </View>
    </View>*/
  );
}

const styles = StyleSheet.create({
  connectedDevices: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    gap: 16,
    marginTop: Constants.statusBarHeight,
  },
});
