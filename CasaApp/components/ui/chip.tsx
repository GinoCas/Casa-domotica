import { View, Text } from "react-native";
import GlobalStyles from "../../Utils/globalStyles";

export function Chip({ text }: { text: string | number }) {
  return (
    <View
      style={{
        padding: 2,
        paddingHorizontal: 7,
        backgroundColor: GlobalStyles.enabledColor,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white" }}>{text}</Text>
    </View>
  );
}
