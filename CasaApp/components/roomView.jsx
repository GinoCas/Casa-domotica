import { View, Text, StyleSheet } from "react-native";
import { Chip } from "./chip";
import { DeviceCard } from "./deviceCard";
import { useState } from "react";

export function RoomView() {
  const roomName = useState("/living");

  return (
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
