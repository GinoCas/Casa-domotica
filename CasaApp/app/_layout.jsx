import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import Constants from "expo-constants";

export default function Layout() {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
        }}
      >
        <Text>ComboRooms</Text>
        <Text>Profile</Text>
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    marginTop: Constants.statusBarHeight,
  },
});
