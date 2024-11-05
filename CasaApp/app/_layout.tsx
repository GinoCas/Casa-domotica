import { Text } from "react-native";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#ddd" },
        headerTitle: "",
        headerLeft: () => <Text>ComboRooms</Text>,
        headerRight: () => <Text>Profile</Text>,
      }}
    ></Stack>
  );
}

/*
<Stack.Screen name="index" options={{}} />
<Stack.Screen name="nashei" options={{}} />
*/
