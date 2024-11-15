import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Switch } from "../ui/switch";
import GlobalStyles from "@/Utils/globalStyles";
import Device, { DeviceType } from "@/types/Device";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";

export function DeviceCard({
  device,
  onPressAction,
  handleToogleEnabled,
}: {
  device: Device;
  onPressAction?: () => void;
  handleToogleEnabled: (device: Device, newState: boolean) => void;
}) {
  const [isEnabled, setIsEnabled] = useState(device.baseProperties.state);

  const toggleEnabled = async () => {
    setIsEnabled(!isEnabled);
    handleToogleEnabled(device, isEnabled);
  };

  const renderIcon = (deviceType: DeviceType) => {
    const iconColor = isEnabled ? "#f1c40f" : GlobalStyles.disabledColor;
    const defaultColor = isEnabled ? "#000" : GlobalStyles.disabledColor;
    switch (deviceType) {
      case "Led":
        return (
          <Ionicons
            name={isEnabled ? "bulb" : "bulb-outline"}
            size={24}
            color={iconColor}
          />
        );
      case "Fan":
        return (
          <MaterialCommunityIcons name="fan" size={24} color={defaultColor} />
        );
      case "Tv":
        return <FontAwesome5 name="tv" size={24} color={defaultColor} />;
      default:
        return <FontAwesome5 name="plug" size={24} color={defaultColor} />;
    }
  };

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={onPressAction}
          style={{
            backgroundColor: "#fff",
            width: 45,
            height: 45,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
          }}
        >
          {renderIcon(device.deviceType)}
        </TouchableOpacity>
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 8 }}
        >
          <Text
            style={{ fontSize: 12, color: GlobalStyles.disabledText.color }}
          >
            Voltage
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: isEnabled
                  ? GlobalStyles.enabledColor
                  : GlobalStyles.disabledColor,
              }}
            >
              {device.baseProperties.voltage}
            </Text>
            <FontAwesome6
              name="bolt-lightning"
              size={12}
              color={
                isEnabled
                  ? GlobalStyles.enabledColor
                  : GlobalStyles.disabledColor
              }
            />
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 16, fontWeight: 600 }}>{device.deviceType}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Switch isEnabled={isEnabled} toggleEnabled={toggleEnabled} />
        <Text style={GlobalStyles.disabledText}>
          {isEnabled ? "On" : "Off"}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    width: 170,
    padding: 20,
    marginBottom: 10,
    gap: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 15,
  },
});
