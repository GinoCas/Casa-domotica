import { Stack } from "expo-router";
import { View, Text } from "react-native";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "red" },
          headerTitle: "",
          headerLeft: () => <Text>Living Room</Text>,
          headerRight: () => <Text>Profile</Text>,
        }}
      />
      <View>
        <Text>Test</Text>
      </View>
    </View>
  );
}
