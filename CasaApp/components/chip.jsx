import { View, Text } from "react-native";
import { getGlobalStyles } from "../Utils/globalStyles";

export function Chip({ text }) {
  return (
    <View
      style={{
        padding: 2,
        paddingHorizontal: 7,
        backgroundColor: getGlobalStyles().enabledColor,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white" }}>{text}</Text>
    </View>
  );
}
