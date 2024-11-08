import { View, Text, StyleSheet, FlatList } from "react-native";
import { Chip } from "../ui/chip";
import { DeviceCard } from "./device-card";

export function RoomView({
  roomName,
  devices,
}: {
  roomName: string;
  devices: any[];
}) {
  return (
    <View>
      <Text>{roomName}</Text>
      <View style={styles.connectedDevices}>
        <Text>Connected Devices</Text>
        <Chip text={devices.length} />
      </View>
      <FlatList
        data={devices}
        keyExtractor={(device) => device.Id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        renderItem={({ item, index }) => (
          <DeviceCard device={item} key={index} />
        )}
      />
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
});
