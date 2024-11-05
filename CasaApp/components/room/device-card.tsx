import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { getGlobalStyles } from "@/Utils/globalStyles";
import { Device } from "@/types/Device";

export function DeviceCard({ device }: { device: Device }) {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleEnabled = () => setIsEnabled(!isEnabled);
  /*
    <Image source={icon} style={{ width: 30, height: 30 }} />
  */
  return (
    <View style={styles.card}>
      <View
        style={{
          backgroundColor: "#fff",
          width: 45,
          height: 45,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 100,
        }}
      ></View>
      <Text>{device.Id}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Switch isEnabled={isEnabled} toggleEnabled={toggleEnabled} />
        <Text style={globalStyles.disabledText}>
          {isEnabled ? "On" : "Off"}
        </Text>
      </View>
    </View>
  );
}
const globalStyles = getGlobalStyles();
const styles = StyleSheet.create({
  card: {
    width: 170,
    padding: 20,
    marginBottom: 10,
    gap: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 15,
  },
});
