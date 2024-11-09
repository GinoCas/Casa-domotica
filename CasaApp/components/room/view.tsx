import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Chip } from "../ui/chip";
import { DeviceCard } from "./device-card";
import Device from "@/types/Device";
import Loader from "../ui/Loader";
import GlobalStyles from "@/Utils/globalStyles";
import { Feather } from "@expo/vector-icons";

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
          <TouchableOpacity style={[styles.largeButton, { marginVertical: 8 }]}>
            <Text>
              <Feather
                name="plus"
                size={24}
                color={GlobalStyles.enabledColor}
              />
            </Text>
            <Text style={styles.buttonText}>Add Device</Text>
          </TouchableOpacity>
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
  largeButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: GlobalStyles.enabledColor,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
  },
  buttonText: {
    textAlign: "center",
    color: GlobalStyles.enabledColor,
  },
});
