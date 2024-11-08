import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={20} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Automations"
        options={{
          title: "Automations",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={20} name="robot" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
