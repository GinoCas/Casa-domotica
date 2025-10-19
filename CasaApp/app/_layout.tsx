import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AppHeader from "@/components/ui/AppHeader";

export default function Layout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#086ce5" />
      <Stack
        screenOptions={{
          header: () => <AppHeader />,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="automation/[id]" />
      </Stack>
    </>
  );
}
