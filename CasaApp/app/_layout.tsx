import { Stack } from "expo-router";
import AppHeader from "@/components/ui/AppHeader";
import { useEffect } from "react";
import bluetoothConnection from "@/lib/bluetoothLE";

export default function Layout() {
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
