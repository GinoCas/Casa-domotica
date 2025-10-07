import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { Chip } from "../ui/chip";
import { DeviceCard } from "./device-card";
import Loader from "../ui/Loader";
import GlobalStyles from "@/Utils/globalStyles";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomModal from "../ui/modal";
import Slider from "@react-native-community/slider";
import { debounce } from "lodash";
import useModeStore from "@/stores/useModeStore";
import useDeviceStore from "@/stores/useDeviceStore";
import { Device } from "@/src/core/entities/Device";
import useRoomStore from "@/stores/useRoomStore";
import DeviceModal from "../device/device-modal";
import { DeviceDto } from "@/src/application/dtos/DeviceDto";
import { Room } from "@/src/core/entities/Room";

interface RoomViewProps {
  devices: Device[];
  loadingRoomDevices: boolean;
  unassignedDevices: Device[];
}

export function RoomView({
  devices,
  loadingRoomDevices,
  unassignedDevices,
}: RoomViewProps) {
  const {
    getDeviceById,
    setDeviceBrightness,
    toggleDeviceState,
    updateDevice,
    isLoadingDevices,
  } = useDeviceStore();
  const {
    currentRoom,
    isLoadingRooms,
    rooms,
    addDeviceToRoom,
    getRoomOfDeviceId,
  } = useRoomStore();
  const { changeSaveEnergyMode } = useModeStore();

  const [selectedDevice, setSelectedDevice] = useState<Device>();
  const [selectedDeviceRoom, setSelectedDeviceRoom] = useState<Room>();
  const [isModalOpen, setisModalOpen] = useState(false);

  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => !unassignedDevices.includes(d));
  }, [devices, unassignedDevices]);

  const openBrightnessModal = (device: Device) => {
    if (device.capabilities.some((c) => c.capabilityType === "Dimmable")) {
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

  if (isLoadingRooms || loadingRoomDevices || isLoadingDevices)
    return <Loader size="large" />;

  if (devices.length === 0)
    return (
      <Text style={{ textAlign: "center" }}>
        No se encontraron dispositivos
      </Text>
    );

  const handlePressDevice = (device: Device) => {
    setSelectedDevice(device);
    setSelectedDeviceRoom(getRoomOfDeviceId(device.id).data);
    setIsDeviceModalOpen(true);
  };

  const handleSubmitDevice = (
    name: string,
    description: string,
    roomId: number | undefined,
  ) => {
    if (!selectedDevice) {
      return;
    }
    if (
      name !== selectedDevice.name ||
      description !== selectedDevice.description
    ) {
      const dto = new DeviceDto(name, description);
      updateDevice(selectedDevice.id, dto);
    }
    if (roomId) {
      addDeviceToRoom(roomId, selectedDevice.id, selectedDeviceRoom?.id);
    }
  };

  const renderListHeader = () => {
    return (
      <View>
        {unassignedDevices.length !== 0 && currentRoom?.name === "Todas" && (
          <>
            <View style={styles.connectedDevices}>
              <Text style={{ fontWeight: "600" }}>
                Dispositivos sin asignar
              </Text>
              <Chip text={unassignedDevices.length} />
            </View>
            <View style={styles.devicesGrid}>
              {unassignedDevices.map((device) => (
                <View key={device.id} style={styles.deviceCardWrapper}>
                  <DeviceCard
                    handleToogleEnabled={handleToggleEnabled}
                    device={device}
                    onCardPress={() => handlePressDevice(device)}
                  />
                </View>
              ))}
            </View>
          </>
        )}
        {filteredDevices.length !== 0 && (
          <View style={styles.connectedDevices}>
            <Text style={{ fontWeight: "600" }}>Dispositivos conectados</Text>
            <Chip text={filteredDevices.length} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ marginTop: 16, flex: 1 }}>
      <FlatList
        data={filteredDevices}
        keyExtractor={(device) => device.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        ListHeaderComponent={renderListHeader}
        renderItem={({ item }) => (
          <DeviceCard
            handleToogleEnabled={handleToggleEnabled}
            key={item.id}
            device={item}
            onCardPress={() => handlePressDevice(item)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
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
      <DeviceModal
        rooms={rooms}
        currentDevice={selectedDevice}
        roomId={selectedDeviceRoom ? selectedDeviceRoom.id : undefined}
        isOpen={isDeviceModalOpen}
        onSubmit={handleSubmitDevice}
        onClose={() => {
          setIsDeviceModalOpen(false);
          setSelectedDevice(undefined);
          setSelectedDeviceRoom(undefined);
        }}
      />
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
  devicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  deviceCardWrapper: {
    width: "48%",
    marginBottom: 8,
  },
});
