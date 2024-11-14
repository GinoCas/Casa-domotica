import { View, Text, StyleSheet, FlatList } from "react-native";
import { Chip } from "../ui/chip";
import { DeviceCard } from "./device-card";
import Device from "@/types/Device";
import Loader from "../ui/Loader";
import GlobalStyles from "@/Utils/globalStyles";
import { Feather } from "@expo/vector-icons";
import DottedButton from "../ui/dotted-button";
import { useCallback, useState } from "react";
import CustomModal from "../ui/modal";
import Slider from "@react-native-community/slider";
import { debounce } from "lodash";
import { GetDeviceById, UpdateDevice } from "@/lib/deviceController";

export function RoomView({
  /*   roomName, */
  devices,
  isLoadingDevices,
}: {
  roomName: string;
  devices: Device[];
  isLoadingDevices: boolean;
}) {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const openBrightnessModal = (device: Device) => {
    if (device.deviceType === "Led") {
      setSelectedDevice(GetDeviceById(device.baseProperties.id));
      setisModalOpen(true);
    }
  };

  const handleBrightnessChange = useCallback(
    debounce((value) => {
      if (selectedDevice) {
        const newLedState = {
          ...selectedDevice,
          baseProperties: {
            ...selectedDevice.baseProperties,
          },
          brightness: value,
        };
        UpdateDevice(newLedState);
      }
    }, 300),
    [selectedDevice],
  );

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
              <DeviceCard
                key={index}
                device={item}
                onPressAction={() => openBrightnessModal(item)}
              />
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
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setisModalOpen(false)}
        title="Brightness"
      >
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={255}
          step={1}
          minimumTrackTintColor={GlobalStyles.secondaryColor}
          maximumTrackTintColor={GlobalStyles.secondaryColor}
          thumbTintColor={GlobalStyles.enabledColor}
          onValueChange={handleBrightnessChange}
        />
      </CustomModal>
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
