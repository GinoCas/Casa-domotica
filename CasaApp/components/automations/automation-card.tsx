import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import GlobalStyles from "@/Utils/globalStyles";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function AutomationCard({ automation }: { automation?: any }) {
  return (
    <View style={styles.cardContainer}>
      <View>
        <Text style={styles.title}>{automation.name}</Text>
        <Text style={styles.subtitle}>{automation.description}</Text>
      </View>
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
});
