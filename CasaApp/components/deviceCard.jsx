import { Image, StyleSheet, Text, View } from "react-native";
import icon from "../assets/icon.png";
import { useState } from "react";
import { Switch } from "./switch";
import { getGlobalStyles } from "../lib/globalStyles";

export function DeviceCard() {
  const [isEnabled, setIsEnabled] = useState(false);
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
      >
        <Image source={icon} style={{ width: 30, height: 30 }} />
      </View>
      <Text>Led</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Switch isEnabled={isEnabled} setIsEnabled={setIsEnabled} />
        <Text style={globalStyles.disabledText}>
          {isEnabled ? "On" : "Off"}
        </Text>
      </View>
    </View>
  );
}
const globalStyles = StyleSheet.create(getGlobalStyles());
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
