import { Stack } from "expo-router";
import AppHeader from "@/components/ui/AppHeader";
import { useEffect } from "react";
import bluetoothConnection from "@/lib/bluetoothConnection";

export default function Layout() {
  useEffect(() => {
    bluetoothConnection.requestPermissions();
    bluetoothConnection.connectToDevice();
  });
  return (
    <Stack
      screenOptions={{
        header: () => <AppHeader />,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
