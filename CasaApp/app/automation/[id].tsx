import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
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

export default function AutomationId() {
  const { id } = useLocalSearchParams();

  const [currentAutomation, setCurrentAutomation] = useState(() => {
    return GetAutomationById(Number(id));
  });

  const [devicesList, setDevicesList] = useState(() => {
    if (!currentAutomation) {
      return [];
    }
    return GetAutomationDeviceList(currentAutomation.id);
  });
  /*DevicesData.filter((device) =>
      currentAutomation?.devices.some(
        (automationDevice) => automationDevice.id === device.baseProperties.id
      )
    ).map((device) => {
      const matchingAutomationDevice = currentAutomation?.devices.find(
        (automationDevice) => automationDevice.id === device.baseProperties.id
      );
      return {
        ...device,
        baseProperties: {
          ...device.baseProperties,
          state: matchingAutomationDevice
            ? matchingAutomationDevice.state
            : device.baseProperties.state,
        },
      };
    })*/

  const [date, setDate] = useState({
    starts: new Date(),
    ends: new Date(),
  });

  const onChange = (
    value: "starts" | "ends",
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (!currentAutomation) return;
    const currentDate = selectedDate;
    setDate({ ...date, [value]: currentDate });
    UpdateAutomation(currentAutomation);
  };

  const showTimepicker = (value: "starts" | "ends") => {
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

  return (
    <Container>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
        }}
      >
        {currentAutomation?.title}
      </Text>
      <Text style={{ color: "#a6a6a6", marginVertical: 4 }}>
        {currentAutomation?.description}
      </Text>
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginTop: 8,
          }}
        >
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => showTimepicker("starts")}
          >
            <Text style={{ color: "#fff" }}>
              Inicio: {getTimeString(date.starts)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => showTimepicker("ends")}
          >
            <Text style={{ color: "#fff" }}>
              Fin: {getTimeString(date.ends)}
            </Text>
          </TouchableOpacity>
        </View>
        <Text>
          <FontAwesome5 name="clock" size={16} color="black" />
        </Text>
      </View>
      <View style={{ flexDirection: "row", paddingVertical: 16 }}>
        <Text style={{ fontWeight: "600" }}>Devices </Text>
        <Chip text={currentAutomation?.devices.length.toString() || ""} />
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
  timeButton: {
    padding: 8,
    backgroundColor: GlobalStyles.enabledColor,
    borderRadius: 10,
  },
});
