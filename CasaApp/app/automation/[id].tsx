import { useEffect, useState } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Container } from "@/components/ui/container";
import { Chip } from "@/components/ui/chip";
import { DeviceCard } from "@/components/room/device-card";
import AutomationHeader from "@/components/automations/automation-header";
import GlobalStyles from "@/Utils/globalStyles";
import getTimeString from "@/Utils/getTimeString";
import { parseTimeString } from "@/Utils/parseTimeString";
import useAutomation from "@/hooks/useAutomations";
import { deviceService } from "@/src/services/DeviceService";
import useDeviceStore from "@/stores/useDeviceStore";
import { Automation } from "@/src/core/entities/Automation";
import { Device } from "@/src/core/entities/Device";
import Loader from "@/components/ui/Loader";

export default function AutomationId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getAutomationById,
    createAutomation,
    updateAutomation,
    deleteAutomation,
  } = useAutomation();

  const [currentAutomation, setCurrentAutomation] = useState<Automation>();
  const [originalAutomation, setOriginalAutomation] = useState<Automation>();
  const [loadingAutomation, setLoadingAutomation] = useState(true);

  useEffect(() => {
    const loadAutomation = async () => {
      setLoadingAutomation(true);
      let automation: Automation | null | undefined;
      if (id === "-1") {
        automation = await createAutomation();
      } else {
        automation = getAutomationById(Number(id));
      }
      if (automation === null || automation === undefined) {
        return;
      }

      setCurrentAutomation(automation);
      setOriginalAutomation(automation);
      setLoadingAutomation(false);
    };

    loadAutomation();
  }, [id]);
  /*
  const { initialAuto } = useLocalSearchParams<{ initialAuto: string }>();
  const { updateAutomation, deleteAutomation } = useAutomation();
  const loadingAutomation = true;
  

  const originalAutomation: Automation = useMemo(
    () => Automation.fromApiResponse(JSON.parse(initialAuto)),
    [initialAuto],
  );

  const [currentAutomation, setCurrentAutomation] = useState<Automation>(() =>
    Automation.fromApiResponse(JSON.parse(initialAuto)),
  );
  */

  const onChangeDate = (
    value: "initTime" | "endTime",
    _: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (!currentAutomation) return;
    const newAutomationState =
      value === "initTime"
        ? currentAutomation.withInitTime(getTimeString(selectedDate as Date))
        : currentAutomation.withEndTime(getTimeString(selectedDate as Date));
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
      if (device.id === selectedDevice.id) {
        return { ...device, state: !newState };
      }
      return device;
    });
    const updatedAuto = currentAutomation.withDevices(updatedDevices);

    setCurrentAutomation(updatedAuto);
    updateAutomation(updatedAuto);
  };

  const handleSave = () => {
    if (!currentAutomation) return;
    updateAutomation(currentAutomation);
  };

  const handleCancel = () => setCurrentAutomation(originalAutomation);

  const handleDelete = () => {
    if (!currentAutomation) return;
    deleteAutomation(currentAutomation.id);
    router.back();
  };

  const handleChangeText = (key: "name" | "description", value: string) => {
    if (!currentAutomation) return;
    const updatedAutomation =
      key === "name"
        ? currentAutomation.withName(value)
        : currentAutomation.withDescription(value);
    setCurrentAutomation(updatedAutomation);
  };

  const { devices, handleLoadDevices } = useDeviceStore();

  useEffect(() => {
    const loadDevices = async () => {
      const devicesResult = await deviceService.getDeviceList();
      if (!devicesResult.isSuccess) {
        console.log("Error on loading devices", devicesResult.errors);
        return;
      }
      handleLoadDevices(devicesResult.data);
    };
    loadDevices();
  }, [handleLoadDevices]);

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
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <Container>
      {loadingAutomation || !currentAutomation ? (
        <View style={styles.loaderContainer}>
          <Loader size="large" />
        </View>
      ) : (
        <>
          <AutomationHeader
            handleCancel={handleCancel}
            handleSave={handleSave}
            handleDelete={handleDelete}
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
            renderItem={({ item }) => {
              const device = devices[item.id];
              return (
                <DeviceCard
                  key={item.id}
                  device={device}
                  handleToogleEnabled={handleToggleEnabled}
                />
              );
            }}
          />
        </>
      )}
    </Container>
  );
}
