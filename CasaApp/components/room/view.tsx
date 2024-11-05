import { View, Text, StyleSheet, FlatList } from "react-native";
import { Chip } from "../ui/chip";
import { DeviceCard } from "./device-card";
import { useEffect, useState } from "react";
import { GetDeviceList } from "../../lib/deviceController";
import { Device } from "@/types/Device";

export function RoomView({ roomName = "living" }: { roomName: string }) {
  const [devices, setDevices] = useState<Device[]>([]);
  useEffect(() => {
    GetDeviceList().then((devicesResponse) => {
      console.log(devicesResponse.leds);
      setDevices(devicesResponse.leds);
    });
  }, []);

  return (
    <View>
      <View style={styles.connectedDevices}>
        <Text>Connected Devices</Text>
        <Chip text="5" />
      </View>
      <View style={styles.deviceList}>
        <FlatList
          data={devices}
          keyExtractor={(device) => device.Id.toString()}
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
