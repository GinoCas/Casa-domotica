import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import GlobalStyles from "@/Utils/globalStyles";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Switch } from "../ui/switch";

export default function AutomationCard({ automation }: { automation?: any }) {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: isEnabled ? "#fff" : "#e1e1e1" },
      ]}
    >
      <View>
        <Text style={styles.title}>{automation.name}</Text>
        <Text style={styles.subtitle}>{automation.description}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <Switch
          toggleEnabled={() => setIsEnabled(!isEnabled)}
          isEnabled={isEnabled}
        />
        <TouchableOpacity>
          <Text>
            <FontAwesome5
              name="chevron-right"
              size={20}
              color={GlobalStyles.enabledColor}
            />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: GlobalStyles.disabledColor,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#a6a6a6",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
