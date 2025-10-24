import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AppHeader from "@/components/ui/AppHeader";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import StartupAnimation from "@/components/ui/startup-animation";

export default function Layout() {
  const [showAnimation, setShowAnimation] = useState(true);
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!showAnimation) {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [showAnimation, contentOpacity]);

  return (
    <>
      <StatusBar style="light" backgroundColor="#086ce5" translucent={false} />
      {showAnimation && (
        <StartupAnimation onFinish={() => setShowAnimation(false)} />
      )}
      <Animated.View style={{ flex: 1, opacity: contentOpacity }}>
        <Stack
          screenOptions={{
            header: () => <AppHeader />,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="automation/[id]" />
        </Stack>
      </Animated.View>
    </>
  );
}
