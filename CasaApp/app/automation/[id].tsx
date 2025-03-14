import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Container } from "@/components/ui/container";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Chip } from "@/components/ui/chip";
import { DeviceCard } from "@/components/room/device-card";
import Device from "@/types/Device";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import GlobalStyles from "@/Utils/globalStyles";
import getTimeString from "@/Utils/getTimeString";
import {
  GetAutomationById,
  GetAutomationDeviceList,
  UpdateAutomation,
} from "@/lib/automationController";
import { Automation } from "@/types/Automation";
import { parseTimeString } from "@/Utils/parseTimeString";

export default function AutomationId() {
  const { id } = useLocalSearchParams();

  const [currentAutomation, setCurrentAutomation] = useState(() => {
    return GetAutomationById(Number(id));
  });

  const [editMode, setEditMode] = useState(false);
  const [editedAutomation, setEditedAutomation] = useState({
    title: currentAutomation.title,
    description: currentAutomation.description,
  });

  const [devicesList, setDevicesList] = useState(() => {
    if (!currentAutomation) {
      return [];
    }
    return GetAutomationDeviceList(currentAutomation.id);
  });

  const [date, setDate] = useState({
    initTime: new Date(parseTimeString(currentAutomation.initTime)),
    endTime: new Date(parseTimeString(currentAutomation.endTime)),
  });

  const onChange = (
    value: "initTime" | "endTime",
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (!currentAutomation) return;
    const currentDate = selectedDate || date[value];
    setDate({ ...date, [value]: currentDate });
    const updatedAuto: Automation = {
      ...currentAutomation,
      [value]: getTimeString(currentDate),
    };
    UpdateAutomation(updatedAuto);
  };

  const showTimepicker = (value: "initTime" | "endTime") => {
    DateTimePickerAndroid.open({
      value: date[value],
      onChange: (e, date) => onChange(value, e, date),
      mode: "time",
      is24Hour: true,
    });
  };

  const handleToggleEnabled = (device: Device, newState: boolean) => {
    if (!currentAutomation) return;
    const updatedAuto: Automation = {
      ...currentAutomation,
      devices: currentAutomation.devices.map((d) => {
        if (d.id === device.baseProperties.id) {
          return { ...d, state: !newState };
        }
        return d;
      }),
    };
    setCurrentAutomation(updatedAuto);
    UpdateAutomation(updatedAuto);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    if (!currentAutomation) return;

    const updatedAuto: Automation = {
      ...currentAutomation,
      title: editedAutomation.title,
      description: editedAutomation.description,
    };

    setCurrentAutomation(updatedAuto);
    UpdateAutomation(updatedAuto);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedAutomation({
      title: currentAutomation.title,
      description: currentAutomation.description,
    });
    setEditMode(false);
  };

  return (
    <Container>
      <View style={styles.headerContainer}>
        {editMode ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.titleInput}
              value={editedAutomation.title}
              onChangeText={(text) =>
                setEditedAutomation({ ...editedAutomation, title: text })
              }
              placeholder="Title"
            />
            <TextInput
              style={styles.descriptionInput}
              value={editedAutomation.description}
              onChangeText={(text) =>
                setEditedAutomation({ ...editedAutomation, description: text })
              }
              placeholder="Description"
              multiline
            />
            <View style={styles.editButtonsContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
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

      <View style={styles.timeContainer}>
        <View style={styles.timeButtonsContainer}>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => showTimepicker("initTime")}
          >
            <Text style={{ color: "#fff" }}>
              Inicio: {getTimeString(date.initTime)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => showTimepicker("endTime")}
          >
            <Text style={{ color: "#fff" }}>
              Fin: {getTimeString(date.endTime)}
            </Text>
          </TouchableOpacity>
        </View>
        <Text>
          <FontAwesome5 name="clock" size={16} color="black" />
        </Text>
      </View>

      <View style={styles.devicesHeader}>
        <Text style={{ fontWeight: "600" }}>Devices </Text>
        <Chip text={currentAutomation.devices.length.toString()} />
      </View>

      <FlatList
        data={devicesList}
        keyExtractor={(device) => device.baseProperties.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        renderItem={({ item }) => (
          <DeviceCard
            key={item.baseProperties.id}
            device={item as Device}
            handleToogleEnabled={handleToggleEnabled}
          />
        )}
      />
    </Container>
  );
}

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
    color: "#a6a6a6",
    marginVertical: 4,
  },
  editContainer: {
    gap: 8,
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  descriptionInput: {
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
  saveButton: {
    backgroundColor: GlobalStyles.enabledColor,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: GlobalStyles.disabledColor,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  timeContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginBottom: 16,
  },
  timeButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  timeButton: {
    padding: 8,
    backgroundColor: GlobalStyles.enabledColor,
    borderRadius: 10,
  },
  devicesHeader: {
    flexDirection: "row",
    paddingVertical: 16,
  },
});
