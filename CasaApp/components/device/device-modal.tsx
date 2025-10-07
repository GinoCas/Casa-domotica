import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import CustomModal from "../ui/modal";
import { Picker } from "@react-native-picker/picker";
import { Room } from "@/src/core/entities/Room";
import { Device } from "@/src/core/entities/Device";
import useRoomStore from "@/stores/useRoomStore";

const DeviceModal = ({
  rooms,
  currentDevice,
  isOpen,
  onSubmit,
  onClose,
}: {
  rooms: Room[];
  currentDevice: Device | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    description: string,
    roomId: number | undefined,
  ) => void;
}) => {
  const [name, setName] = useState(currentDevice?.name);
  const [description, setDescription] = useState(currentDevice?.description);
  const [roomId, setRoomId] = useState<number | undefined>(undefined);

  useEffect(() => {
    setName(currentDevice?.name || "");
    setDescription(currentDevice?.description || "");
  }, [currentDevice]);

  const handleSave = () => {
    onSubmit(name!, description!, roomId);
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
          /*selectedValue={currentRoom}*/
          style={{ width: 150 }}
          onValueChange={(itemValue: Room) => setRoomId(itemValue.id)}
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
