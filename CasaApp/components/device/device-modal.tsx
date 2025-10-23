import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import CustomModal from "../ui/modal";
import { Picker } from "@react-native-picker/picker";
import { Room } from "@/src/core/entities/Room";
import { Device } from "@/src/core/entities/Device";

const DeviceModal = ({
  rooms,
  currentDevice,
  isOpen,
  roomId: initialRoomId,
  onSubmit,
  onClose,
}: {
  rooms: Room[];
  currentDevice: Device | undefined;
  isOpen: boolean;
  roomId: number | undefined;
  onClose: () => void;
  onSubmit: (
    name: string,
    description: string,
    roomId: number | undefined,
  ) => void;
}) => {
  const [name, setName] = useState(currentDevice?.name);
  const [description, setDescription] = useState(currentDevice?.description);
  const [roomId, setRoomId] = useState<number | undefined>(initialRoomId);

  useEffect(() => {
    setName(currentDevice?.name || "");
    setDescription(currentDevice?.description || "");
    setRoomId(initialRoomId);
  }, [currentDevice, initialRoomId]);

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
          style={{ width: "auto" }}
          selectedValue={roomId}
          onValueChange={(itemValue: number) => setRoomId(itemValue)}
        >
          <Picker.Item
            label="Selecciona una habitación"
            value={undefined}
            enabled={false}
          />

          {rooms
            .filter((room) => room.name !== "Todas")
            .map((room) => (
              <Picker.Item label={room.name} key={room.name} value={room.id} />
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
