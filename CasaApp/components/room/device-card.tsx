import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Switch } from "../ui/switch";
import GlobalStyles from "@/Utils/globalStyles";
import Device, { DeviceType } from "@/types/Device";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export function DeviceCard({ device }: { device: Device }) {
  const [isEnabled, setIsEnabled] = useState(device.baseProperties.state);

  const toggleEnabled = () => setIsEnabled(!isEnabled);

  const renderIcon = (deviceType: DeviceType) => {
    switch (deviceType) {
      case "Led":
        return <FontAwesome5 name="lightbulb" size={24} color="black" />;
      case "Fan":
        return <MaterialCommunityIcons name="fan" size={24} color="black" />;
      default:
        return <FontAwesome5 name="plug" size={24} color="black" />;
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
        <View
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
        </View>
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 8 }}
        >
          <Text
            style={{ fontSize: 12, color: GlobalStyles.disabledText.color }}
          >
            Voltage
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: isEnabled
                ? GlobalStyles.enabledColor
                : GlobalStyles.disabledColor,
            }}
          >
            {device.baseProperties.voltage}v
          </Text>
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
