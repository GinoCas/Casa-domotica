import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import GlobalStyles from "@/Utils/globalStyles";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Switch } from "../ui/switch";
import { Link } from "expo-router";
import { Automation } from "@/types/Automation";
import { UpdateAutomation } from "@/lib/automationController";

export default function AutomationCard({
  automation,
}: {
  automation: Automation;
}) {
  const [isEnabled, setIsEnabled] = useState(automation?.state);

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: isEnabled ? "#fff" : "#e1e1e1" },
      ]}
    >
      <View style={{ maxWidth: 190 }}>
        <Text style={styles.title}>{automation.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {automation.description}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <Switch
          toggleEnabled={() => {
            setIsEnabled(!isEnabled);
            UpdateAutomation(automation);
          }}
          isEnabled={isEnabled}
        />
        <Link
          style={{
            backgroundColor: GlobalStyles.enabledColor,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
          href={`/automation/${automation.id}`}
        >
          <Text>
            <FontAwesome5 name="chevron-right" size={20} color="#fff" />
          </Text>
        </Link>
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
    maxWidth: 190,
    overflow: "hidden",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
});
