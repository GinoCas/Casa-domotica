import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { Chip } from "../ui/chip";
import { DeviceCard } from "./device-card";
import Loader from "../ui/Loader";
import GlobalStyles from "@/Utils/globalStyles";
import { Feather } from "@expo/vector-icons";
import DottedButton from "../ui/dotted-button";
import { useCallback, useState } from "react";
import CustomModal from "../ui/modal";
import Slider from "@react-native-community/slider";
import { debounce } from "lodash";
import useModeStore from "@/stores/useModeStore";
import useDeviceStore from "@/stores/useDeviceStore";
import { Device } from "@/src/core/entities/Device";
import useRoomStore from "@/stores/useRoomStore";

export function RoomView({
  devices,
  loadingRoomDevices,
}: {
  devices: Device[];
  loadingRoomDevices: boolean;
}) {
  const { getDeviceById, setDeviceBrightness, toggleDeviceState } =
    useDeviceStore();
  const { currentRoom, isLoadingRooms } = useRoomStore();
  const [selectedDevice, setSelectedDevice] = useState<Device>();
  const { changeSaveEnergyMode } = useModeStore();
  const [isModalOpen, setisModalOpen] = useState(false);

  const openBrightnessModal = (device: Device) => {
    if (device.deviceType === "Led") {
      // Buscar el device en el store para obtener el estado completo
      const deviceResult = getDeviceById(device.id);
      if (deviceResult.isSuccess) {
        setSelectedDevice(deviceResult.data);
        setisModalOpen(true);
      }
    }
  };

  const handleBrightnessChange = useCallback(
    (value: number) =>
      debounce((value) => {
        if (selectedDevice) {
          changeSaveEnergyMode(false);
          setDeviceBrightness(selectedDevice.id, value);
        }
      }, 300),
    [selectedDevice, changeSaveEnergyMode, setDeviceBrightness],
  );

  const handleToggleEnabled = (device: Device, newState: boolean) => {
    toggleDeviceState(device.id, !newState);
  };

  return (
    <SafeAreaView style={{ marginTop: 16, flex: 1 }}>
      {isLoadingRooms || loadingRoomDevices ? (
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader size="large" />
        </View>
      ) : !currentRoom ? (
        <View style={{ flex: 2 }}>
          <View style={styles.connectedDevices}>
            <Text style={{ fontWeight: 600 }}>Dispositivos conectados</Text>
            <Chip text="0" />
          </View>
          <View
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: 600 }}>
              No se encontraron dispositivos
            </Text>
          </View>
        </View>
      ) : (
        <View style={{ flex: 2 }}>
          <View style={styles.connectedDevices}>
            <Text style={{ fontWeight: 600 }}>Dispositivos conectados</Text>
            <Chip text={devices.length} />
          </View>
          <FlatList
            data={devices}
            keyExtractor={(device) => device.id.toString()}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            renderItem={({ item, index }) => (
              <DeviceCard
                handleToogleEnabled={handleToggleEnabled}
                key={item.id}
                device={item}
                onPressAction={() => openBrightnessModal(item)}
              />
            )}
          />
          <View>
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
        </View>
      )}
    </SafeAreaView>
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
