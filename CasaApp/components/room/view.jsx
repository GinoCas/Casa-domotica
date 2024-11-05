import { View, Text, StyleSheet } from "react-native";
import { Chip } from "../ui/chip";
import { DeviceCard } from "./device-card";
import { useState } from "react";

export function RoomView() {
  const roomName = useState("living");

  return (
    <View>
      <View style={styles.connectedDevices}>
        <Text style={styles.semibold}>Connected Devices</Text>
        <Chip text="5" />
      </View>
      <View style={styles.deviceList}>
        {Array.from({ length: 5 }).map((_, i) => (
          <DeviceCard key={i} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  connectedDevices: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 10,
  },
  deviceList: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
