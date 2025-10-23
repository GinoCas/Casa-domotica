import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import GlobalStyles from "@/Utils/globalStyles";
import { Automation } from "@/src/core/entities/Automation";

interface Props {
  currentAutomation: Automation;
  handleSave: () => void;
  handleCancel: () => void;
  handleDelete: () => void;
  handleChangeText: (key: "name" | "description", value: string) => void;
}

const AutomationHeader = ({
  currentAutomation,
  handleCancel,
  handleSave,
  handleDelete,
  handleChangeText,
}: Props) => {
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDeleteHeader = () => {
    Alert.alert(
      "Eliminar automatización",
      `¿Estás seguro que deseas eliminar "${currentAutomation.name}"?`,
      [
        {
          text: "Cancelar",
        },
        {
          text: "Eliminar",
          onPress: () => {
            handleDelete();
          },
        },
      ],
    );
  };

  const handleSaveHeader = () => {
    handleSave();
    setEditMode(false);
  };

  const handleCancelEditHeader = () => {
    handleCancel();
    setEditMode(false);
  };

  return (
    <View style={styles.headerContainer}>
      {editMode ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.input, { fontSize: 20, fontWeight: "600" }]}
            value={currentAutomation.name}
            onChangeText={(text) => handleChangeText("name", text)}
            placeholder="Título"
          />
          <TextInput
            style={styles.input}
            value={currentAutomation.description}
            onChangeText={(text) => handleChangeText("description", text)}
            placeholder="Descripción"
            multiline
          />
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: GlobalStyles.enabledColor },
              ]}
              onPress={handleSaveHeader}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: GlobalStyles.disabledColor },
              ]}
              onPress={handleCancelEditHeader}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{currentAutomation.name}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleEdit}>
                <FontAwesome5
                  name="edit"
                  size={20}
                  color={GlobalStyles.enabledColor}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteHeader}>
                <FontAwesome5
                  name="trash"
                  size={20}
                  color={GlobalStyles.enabledColor}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.description}>
            {currentAutomation.description}
          </Text>
        </View>
      )}
    </View>
  );
};

export default AutomationHeader;

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    maxWidth: 280,
  },
  description: {
    color: "#7f8c8d",
    marginVertical: 4,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    minHeight: 60,
  },
  editButtonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },
  editContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
