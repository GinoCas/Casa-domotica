import { View, Text } from "react-native";

export function Chip({ text }) {
  return (
    <View
      style={{
        padding: 2,
        paddingHorizontal: 7,
        backgroundColor: "#0066ff",
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white" }}>{text}</Text>
    </View>
  );
}
