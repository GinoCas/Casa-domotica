import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Automation } from "@/types/Automation";
import GlobalStyles from "@/Utils/globalStyles";

interface Props {
  currentAutomation: Automation;
  handleSave: () => void;
  handleCancel: () => void;
  handleChangeText: (key: "title" | "description", value: string) => void;
}

const AutomationHeader = ({
  currentAutomation,
  handleCancel,
  handleSave,
  handleChangeText,
}: Props) => {
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
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
            value={currentAutomation.title}
            onChangeText={(text) => handleChangeText("title", text)}
            placeholder="Title"
          />
          <TextInput
            style={styles.input}
            value={currentAutomation.description}
            onChangeText={(text) => handleChangeText("description", text)}
            placeholder="Description"
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
            <Text style={styles.title}>{currentAutomation.title}</Text>
            <TouchableOpacity onPress={handleEdit}>
              <FontAwesome5
                name="edit"
                size={20}
                color={GlobalStyles.enabledColor}
              />
            </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: "700",
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
  editContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
