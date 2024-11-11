import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import GlobalStyles from "@/Utils/globalStyles";
interface Props {
  onPress?: (e: GestureResponderEvent) => void;
  label: string;
  icon?: any;
}

export default function DottedButton({ label, onPress, icon }: Props) {
  return (
    <TouchableOpacity
      style={[styles.largeButton, { marginVertical: 8 }]}
      onPress={onPress}
    >
      <Text>{icon}</Text>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  largeButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: GlobalStyles.enabledColor,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
  },
  buttonText: {
    textAlign: "center",
    color: GlobalStyles.enabledColor,
  },
});
