import { View, Text } from "react-native";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        header: () => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 16,
              backgroundColor: "blue",
            }}
          >
            <Text style={{ color: "#fff" }}>ComboRooms</Text>
            <Text style={{ color: "#fff" }}>Profile</Text>
          </View>
        ),
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[room_name]" />
    </Stack>
  );
}
