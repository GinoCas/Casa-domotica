import { View, Text, StyleSheet, FlatList } from "react-native";
import { Chip } from "../ui/chip";
import { DeviceCard } from "./device-card";
import Device from "@/types/Device";
import Loader from "../ui/Loader";

export function RoomView({
  roomName,
  devices,
  isLoadingDevices,
}: {
  roomName: string;
  devices: Device[];
  isLoadingDevices: boolean;
}) {
  return (
    <View>
      <Text>{roomName}</Text>
      {isLoadingDevices ? (
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader size="large" />
        </View>
      ) : (
        <>
          <View style={styles.connectedDevices}>
            <Text>Connected Devices</Text>
            <Chip text={devices.length} />
          </View>
          <FlatList
            data={devices}
            keyExtractor={(device) => device.baseProperties.id.toString()}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            renderItem={({ item, index }) => (
              <DeviceCard device={item} key={index} />
            )}
          />
        </>
      )}
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
