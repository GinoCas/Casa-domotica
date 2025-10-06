import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import React from "react";
import CustomModal from "../ui/modal";
import { Picker } from "@react-native-picker/picker";
import { Room } from "@/src/core/entities/Room";
import { Device } from "@/src/core/entities/Device";

const DeviceModal = ({
  rooms,
  currentDevice,
  isOpen,
  onClose,
}: {
  rooms: Room[];
  currentDevice: Device | undefined;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurar dispositivo"
    >
      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput style={styles.input} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Habitación</Text>
        <Picker
          /* selectedValue={currentRoom} */
          style={{ width: 150 }}
          onValueChange={(itemValue: Room) => console.log(itemValue)}
        >
          {rooms.map((room) => (
            <Picker.Item label={room.name} key={room.name} value={room} />
          ))}
        </Picker>
      </View>
      <View style={{ width: "100%" }}>
        <Button title="Guardar" onPress={onClose} />
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
