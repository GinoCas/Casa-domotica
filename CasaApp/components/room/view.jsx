import { View, Text, StyleSheet, FlatList } from "react-native";
import { Chip } from "../ui/chip";
import { DeviceCard } from "./device-card";
import { useEffect, useState } from "react";
import { GetDeviceList } from "../../lib/deviceController";

export function RoomView() {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    GetDeviceList().then((devices) => {
      setDevices(devices);
      console.log(devices);
    });
  }, []);
  const roomName = useState("living");

  return (
    <View>
      <View style={styles.connectedDevices}>
        <Text style={styles.semibold}>Connected Devices</Text>
        <Chip text="5" />
      </View>
      <View style={styles.deviceList}>
        <FlatList
          data={devices.leds}
          keyExtractor={(device) => device.Id}
          renderItem={({ item, index }) => (
            <DeviceCard device={item} key={index} />
          )}
        />
      </View>
    </View>
  );
}
/*
{Array.from({ length: 5 }).map((_, i) => (
          <DeviceCard key={i} />
        ))}
*/

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
