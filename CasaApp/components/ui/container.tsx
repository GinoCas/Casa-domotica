import { View } from "react-native";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      {children}
    </View>
  );
}
