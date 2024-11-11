import { View, Text, StyleSheet, FlatList } from "react-native";
import { Chip } from "../ui/chip";
import { DeviceCard } from "./device-card";
import Device from "@/types/Device";
import Loader from "../ui/Loader";
import GlobalStyles from "@/Utils/globalStyles";
import { Feather } from "@expo/vector-icons";
import DottedButton from "../ui/dotted-button";

export function RoomView({
  /*   roomName, */
  devices,
  isLoadingDevices,
}: {
  roomName: string;
  devices: Device[];
  isLoadingDevices: boolean;
}) {
  return (
    <View>
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
            <Text style={{ fontWeight: 600 }}>Connected Devices</Text>
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
          <DottedButton
            label="Add Device"
            icon={
              <Feather
                name="plus"
                size={24}
                color={GlobalStyles.enabledColor}
              />
            }
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
    marginBottom: 10,
    gap: 10,
  },
});
