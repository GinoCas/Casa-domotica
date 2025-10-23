import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { Chip } from "../ui/chip";
import { DeviceCard } from "./device-card";
import Loader from "../ui/Loader";
import GlobalStyles from "@/Utils/globalStyles";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomModal from "../ui/modal";
import Slider from "@react-native-community/slider";
import { debounce } from "lodash";
import useDeviceStore from "@/stores/useDeviceStore";
import { Device } from "@/src/core/entities/Device";
import useRoomStore from "@/stores/useRoomStore";
import DeviceModal from "../device/device-modal";
import { DeviceDto } from "@/src/application/dtos/DeviceDto";
import { Room } from "@/src/core/entities/Room";
import {
  toggleDevice,
  updateDevice,
  refreshDevices,
  getDeviceById,
  setDeviceBrightness,
} from "@/src/services/DeviceActions";

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
  const isLoadingDevices = useDeviceStore((s) => s.isLoadingDevices);
  const {
    currentRoom,
    isLoadingRooms,
    rooms,
    addDeviceToRoom,
    getRoomOfDeviceId,
  } = useRoomStore();

  const [selectedDevice, setSelectedDevice] = useState<Device>();
  const [selectedDeviceRoom, setSelectedDeviceRoom] = useState<Room>();
  const [isModalOpen, setisModalOpen] = useState(false);

  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => !unassignedDevices.includes(d));
  }, [devices, unassignedDevices]);

  const openBrightnessModal = useCallback((device: Device) => {
    console.log(device.capabilities);
    if (device.capabilities.some((c) => c.capabilityType === "Dimmable")) {
      const deviceResult = getDeviceById(device.id);
      if (deviceResult.isSuccess) {
        setSelectedDevice(deviceResult.data);
        setisModalOpen(true);
      }
    }
  }, []);

  const debouncedBrightnessChange = useMemo(
    () =>
      debounce((deviceId: number, value: number) => {
        setDeviceBrightness(deviceId, value);
      }, 300),
    [],
  );

  const handleBrightnessChange = (value: number) => {
    if (selectedDevice) {
      debouncedBrightnessChange(selectedDevice.id, value);
    }
  };

  useEffect(() => {
    return () => {
      debouncedBrightnessChange.cancel();
    };
  }, [debouncedBrightnessChange]);

  const handleToggleEnabled = useCallback(
    (device: Device, newState: boolean) => {
      toggleDevice(device.id, newState);
    },
    [],
  );

  const handlePressDevice = useCallback(
    (device: Device) => {
      setSelectedDevice(device);
      setSelectedDeviceRoom(getRoomOfDeviceId(device.id).data);
      setIsDeviceModalOpen(true);
    },
    [getRoomOfDeviceId],
  );

  const handleSubmitDevice = useCallback(
    (name: string, description: string, roomId: number | undefined) => {
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
    },
    [selectedDevice, selectedDeviceRoom, addDeviceToRoom],
  );

  const handleRefresh = useCallback(async () => {
    await refreshDevices();
  }, []);

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
                    onBrightnessPress={() => openBrightnessModal(device)}
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

  const renderItem = useCallback(
    ({ item }: { item: Device }) => (
      <DeviceCard
        handleToogleEnabled={handleToggleEnabled}
        key={item.id}
        device={item}
        onBrightnessPress={() => openBrightnessModal(item)}
        onCardPress={() => handlePressDevice(item)}
      />
    ),
    [handleToggleEnabled, handlePressDevice, openBrightnessModal],
  );

  if (isLoadingRooms || loadingRoomDevices || isLoadingDevices)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loader size="large" />
      </View>
    );
  if (devices.length === 0)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center" }}>
          No se encontraron dispositivos
        </Text>
      </View>
    );

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
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshing={isLoadingDevices}
        onRefresh={handleRefresh}
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
