import { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Container } from "@/components/ui/container";
import { Chip } from "@/components/ui/chip";
import { DeviceCard } from "@/components/room/device-card";
import AutomationHeader from "@/components/automations/automation-header";
import GlobalStyles from "@/Utils/globalStyles";
import getTimeString from "@/Utils/getTimeString";
import { parseTimeString } from "@/Utils/parseTimeString";
import { getDeviceById } from "@/lib/deviceController";
import useAutomation from "@/hooks/useAutomations";
import { Automation } from "@/types/Automation";
import Device from "@/types/Device";

export default function AutomationId() {
  const { initialAuto } = useLocalSearchParams<{ initialAuto: string }>();
  const { updateAutomation } = useAutomation();

  const [currentAutomation, setCurrentAutomation] = useState<Automation>(
    JSON.parse(initialAuto),
  );

  const originalAutomation: Automation = useMemo(
    () => JSON.parse(initialAuto),
    [initialAuto],
  );

  const onChangeDate = (
    value: "initTime" | "endTime",
    _: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (!currentAutomation) return;
    const newAutomationState = {
      ...currentAutomation,
      [value]: getTimeString(selectedDate as Date),
    };
    setCurrentAutomation(newAutomationState);
    updateAutomation(newAutomationState);
  };

  const showTimepicker = (value: "initTime" | "endTime") => {
    if (currentAutomation) {
      const date = parseTimeString(currentAutomation[value]);
      DateTimePickerAndroid.open({
        value: date,
        onChange: (e, date) => onChangeDate(value, e, date),
        mode: "time",
        is24Hour: true,
      });
    }
  };

  const handleToggleEnabled = (selectedDevice: Device, newState: boolean) => {
    if (!currentAutomation) return;

    const updatedDevices = currentAutomation.devices.map((device) => {
      if (device.id === selectedDevice.baseProperties.id) {
        return { ...device, state: !newState };
      }
      return device;
    });

    const updatedAuto: Automation = {
      ...currentAutomation,
      devices: updatedDevices,
    };
    setCurrentAutomation(updatedAuto);
    updateAutomation(updatedAuto);
  };

  const handleSave = () => {
    if (!currentAutomation) return;
    updateAutomation(currentAutomation);
  };

  const handleCancel = () => setCurrentAutomation(originalAutomation);

  const handleChangeText = (key: "title" | "description", value: string) => {
    setCurrentAutomation({
      ...currentAutomation,
      [key]: value,
    });
  };

  return (
    <Container>
      <AutomationHeader
        handleCancel={handleCancel}
        handleSave={handleSave}
        currentAutomation={currentAutomation}
        handleChangeText={handleChangeText}
      />

      <View style={styles.timeContainer}>
        <View style={styles.timeButtonsContainer}>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => showTimepicker("initTime")}
          >
            <Text style={{ color: "#fff" }}>
              Inicio: {currentAutomation.initTime}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => showTimepicker("endTime")}
          >
            <Text style={{ color: "#fff" }}>
              Fin: {currentAutomation.endTime}
            </Text>
          </TouchableOpacity>
        </View>
        <Text>
          <FontAwesome5 name="clock" size={16} color="black" />
        </Text>
      </View>

      <View style={styles.devicesContainer}>
        <Text style={{ fontWeight: "600" }}>Devices </Text>
        <Chip text={currentAutomation.devices.length.toString() || "0"} />
      </View>

      <FlatList
        data={currentAutomation.devices}
        keyExtractor={(device) => device.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        renderItem={({ item }) => (
          <DeviceCard
            key={item.id}
            device={getDeviceById(item.id)}
            handleToogleEnabled={handleToggleEnabled}
          />
        )}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
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
  devicesContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
});
