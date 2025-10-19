import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Switch } from "../ui/switch";
import GlobalStyles from "@/Utils/globalStyles";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CapabilityType, Device, DeviceType } from "@/src/core/entities/Device";
import { debounce } from "lodash";
import useModeStore from "@/stores/useModeStore";

interface DeviceCardProps {
  device: Device;
  handleToogleEnabled: (device: Device, newState: boolean) => void;
  onCardPress?: () => void;
  onBrightnessPress?: () => void;
}

export const DeviceCard = React.memo(
  ({
    device,
    handleToogleEnabled,
    onCardPress,
    onBrightnessPress,
  }: DeviceCardProps) => {
    const [isEnabled, setIsEnabled] = useState(device.state);
    const { activityMode } = useModeStore();

    useEffect(() => {
      setIsEnabled(device.state);
    }, [device.state]);

    const toggleEnabled = () => {
      if (activityMode) return;
      const newIsEnabled = !isEnabled;
      handleToogleEnabled(device, newIsEnabled);
      setIsEnabled(newIsEnabled);
    };

    const getCapability = (type: CapabilityType) => {
      return device.capabilities.find((c) => c.capabilityType === type);
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
      <TouchableOpacity
        style={[styles.card, activityMode && styles.disabledCard]}
        onPress={onCardPress}
        disabled={activityMode}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={onBrightnessPress}
            disabled={activityMode}
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
                {(getCapability("Dimmable") as any)?.voltage || "220V"}
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
        <Text style={{ fontSize: 16, fontWeight: 600 }}>
          {device?.name || `${device.id}-${device.deviceType}`}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Switch
            isEnabled={isEnabled}
            toggleEnabled={toggleEnabled}
            disabled={activityMode}
          />
          <Text style={GlobalStyles.disabledText}>
            {isEnabled ? "On" : "Off"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);

DeviceCard.displayName = "DeviceCard";

const styles = StyleSheet.create({
  card: {
    width: 170,
    padding: 20,
    marginBottom: 10,
    gap: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 15,
  },
  disabledCard: {
    opacity: 0.5,
  },
});
