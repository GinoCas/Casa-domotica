import { Stack } from "expo-router";
import AppHeader from "@/components/ui/AppHeader";

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
