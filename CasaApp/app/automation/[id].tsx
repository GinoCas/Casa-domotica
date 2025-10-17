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
import { Automation, AutomationDevice } from "@/src/core/entities/Automation";
import { Device } from "@/src/core/entities/Device";
import Loader from "@/components/ui/Loader";
import MultiComboGroup from "@/components/ui/multi-combo-group";
import DottedButton from "@/components/ui/dotted-button";
import { Feather } from "@expo/vector-icons";
import useDeviceStore from "@/stores/useDeviceStore";
import useRoomStore from "@/stores/useRoomStore";
import {
  GroupedOptions,
  Option,
} from "@/components/ui/multi-combo-group/types";
import CustomModal from "@/components/ui/modal";
import WeekDayPicker from "@/components/automations/weekday-picker";

const weekDaysOptions = [1, 2, 4, 8, 16, 32, 64];

export default function AutomationId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getAutomationById,
    createAutomation,
    updateAutomation,
    deleteAutomation,
  } = useAutomation();

  const { devices, getDeviceById } = useDeviceStore();
  const { rooms } = useRoomStore();

  const [currentAutomation, setCurrentAutomation] = useState<Automation>();
  const [originalAutomation, setOriginalAutomation] = useState<Automation>();
  const [loadingAutomation, setLoadingAutomation] = useState(true);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [groupedOptions, setGroupedOptions] = useState<GroupedOptions[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Option[]>([]);

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

  const handleCancel = () => setCurrentAutomation(originalAutomation);
  const handleDelete = () => {
    if (!currentAutomation) return;
    deleteAutomation(currentAutomation.id);
    router.back();
  };

  const handleWeekDayChange = (weekDays: number[]) => {
    if (!currentAutomation) return;
    const daysValue = weekDays.reduce((acc, day) => acc + day, 0);
    const updatedAutomation = currentAutomation.withDays(daysValue);
    setCurrentAutomation(updatedAutomation);
    updateAutomation(updatedAutomation);
  };

  const getWeekDaysFromValue = (value: number) => {
    return weekDaysOptions.filter((day) => (value & day) === day);
  };

  const handleChangeText = (key: "name" | "description", value: string) => {
    if (!currentAutomation) return;
    const updatedAutomation =
      key === "name"
        ? currentAutomation.withName(value)
        : currentAutomation.withDescription(value);
    setCurrentAutomation(updatedAutomation);
  };

  useEffect(() => {
    const prepareGroupedOptions = async () => {
      if (rooms.length === 0 || !devices || devices.length === 0) return;

      const options: GroupedOptions[] = [];

      for (const room of rooms) {
        const roomDevices = devices.filter((device) =>
          room.deviceIds.includes(device.id),
        );
        if (roomDevices.length > 0) {
          options.push({
            label: room.name,
            options: roomDevices.map((device) => ({
              label: device.deviceType,
              deviceId: device.id,
              deviceType: device.deviceType,
            })),
          });
        }
      }
      setGroupedOptions(options);
    };
    prepareGroupedOptions();
  }, [devices]);

  useEffect(() => {
    if (!currentAutomation) {
      return;
    }
    const getSelectedDevices = () => {
      let newSelectedOptions: Option[] = [];
      const matchedDevices = devices.filter((d) =>
        currentAutomation.devices.some((ad) => ad.id === d.id),
      );
      matchedDevices.forEach((d) => {
        const option: Option = {
          deviceId: d.id,
          label: d.deviceType,
          deviceType: d.deviceType,
        };
        newSelectedOptions = [...newSelectedOptions, option];
      });
      if (newSelectedOptions.length === 0) {
        return;
      }
      setSelectedDevices(newSelectedOptions);
    };
    getSelectedDevices();
  }, [originalAutomation]);

  const handleConfirm = async () => {
    if (!currentAutomation) return;
    let devices: AutomationDevice[] = [];
    selectedDevices.forEach((op) => {
      devices = [...devices, { id: op.deviceId, autoState: true }];
    });
    const updatedAutomation = currentAutomation.withDevices(devices);
    setCurrentAutomation(updatedAutomation);
    setShowDeviceSelector(false);
    setLoadingAutomation(true);
    await updateAutomation(updatedAutomation);
    setLoadingAutomation(false);
  };

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
        <View style={{ flex: 2 }}>
          <AutomationHeader
            handleCancel={handleCancel}
            handleSave={handleConfirm}
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
          <View>
            <WeekDayPicker
              onSelectionChange={handleWeekDayChange}
              initialValue={getWeekDaysFromValue(currentAutomation.days)}
            />
          </View>

          <View style={styles.devicesContainer}>
            <Text style={{ fontWeight: "600" }}>Devices </Text>
            <Chip text={currentAutomation.devices.length.toString() || "0"} />
          </View>

          {currentAutomation.devices.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No devices added yet.</Text>
            </View>
          ) : (
            <FlatList
              data={currentAutomation.devices}
              keyExtractor={(device) => device.id.toString()}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
              }}
              renderItem={({ item }) => {
                const device = getDeviceById(item.id).data;
                return (
                  <DeviceCard
                    key={item.id}
                    device={device}
                    handleToogleEnabled={handleToggleEnabled}
                  />
                );
              }}
            />
          )}
          <View>
            <DottedButton
              label="Add Device"
              icon={
                <Feather
                  name="plus"
                  size={24}
                  color={GlobalStyles.enabledColor}
                />
              }
              onPress={() => setShowDeviceSelector(!showDeviceSelector)}
            />
            <CustomModal
              isOpen={showDeviceSelector}
              onClose={() => setShowDeviceSelector(false)}
              title="Seleccionar dispositivos"
            >
              {groupedOptions.length === 0 ? (
                <View style={{ padding: 20 }}>
                  <Text>Related devices not found</Text>
                </View>
              ) : (
                <MultiComboGroup
                  options={groupedOptions}
                  onOptionChange={(options) => setSelectedDevices(options)}
                  onClose={handleConfirm}
                  value={selectedDevices}
                />
              )}
            </CustomModal>
          </View>
        </View>
      )}
    </Container>
  );
}
