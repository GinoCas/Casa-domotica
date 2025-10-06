import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import CustomModal from "../ui/modal";
import { Picker } from "@react-native-picker/picker";
import { Room } from "@/src/core/entities/Room";
import { Device } from "@/src/core/entities/Device";
import useDevices from "@/hooks/useDevices";
import useRooms from "@/hooks/useRooms";
import useRoomStore from "@/stores/useRoomStore";

const DeviceModal = ({
  rooms,
  roomId: initialRoomId
  currentDevice,
  isOpen,
  onClose,
}: {
  rooms: Room[];
  currentDevice: Device | undefined;
  roomId: number | undefined;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { updateDevice, addDeviceToRoom } = useDevices();
  const [name, setName] = useState(currentDevice?.name);
  const [description, setDescription] = useState(currentDevice?.description);
  const [roomId, setRoomId] = useState<number | undefined>(initialRoomId);

  useEffect(() => {
    setName(currentDevice?.name);
    setDescription(currentDevice?.description);
    setRoomId(initialRoomId);
  }, [currentDevice, initialRoomId]);

  const handleSave = () => {
    if (currentDevice) {
      if (name !== currentDevice.name || description !== currentDevice.description) {
        updateDevice(currentDevice.id, name!, description!);
      }
      if (roomId && roomId !== initialRoomId) {
        addDeviceToRoom(roomId, currentDevice.id);
      }
    }
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurar dispositivo"
    >
      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Habitación</Text>
        <Picker
          selectedValue={currentRoom}
          style={{ width: 150 }}
          onValueChange={(itemValue: Room) => handleSetCurrentRoom(itemValue)}
        >
          {rooms.map((room) => (
            <Picker.Item label={room.name} key={room.name} value={room} />
          ))}
        </Picker>
      </View>
      <View style={{ width: "100%" }}>
        <Button title="Guardar" onPress={handleSave} />
      </View>
    </CustomModal>
  );
};

export default DeviceModal;

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  field: {
    marginBottom: 12,
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});
