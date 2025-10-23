import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import Constants from "expo-constants";
import GlobalStyles from "@/Utils/globalStyles";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolateColor,
  Easing,
  runOnJS,
} from "react-native-reanimated";

interface Props {
  onFinish?: () => void;
}

export const STARTUP_ANIMATION_MS = 1600;

export default function StartupAnimation({ onFinish }: Props) {
  const { height } = Dimensions.get("window");
  const targetTranslateY = -(height / 2) + Constants.statusBarHeight + 70; // Aproximación a la zona del header
  const titleTranslateY = useSharedValue(0);
  const meColorProgress = useSharedValue(0);
  const dotOpacity = useSharedValue(0);
  const dotScale = useSharedValue(0.8);
  const dotWidth = useSharedValue(0);
  const [dotVisible, setDotVisible] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    meColorProgress.value = withTiming(1, {
      duration: 750,
      easing: Easing.inOut(Easing.cubic),
    });
    dotWidth.value = withDelay(250, withTiming(10, { duration: 250 }));
    setTimeout(() => setDotVisible(true), 300);
    titleTranslateY.value = withDelay(
      1000,
      withTiming(
        targetTranslateY,
        { duration: 800, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished && onFinish) {
            finishedRef.current = true;
            runOnJS(onFinish)();
          }
        },
      ),
    );
    const fallback = setTimeout(() => {
      if (!finishedRef.current && onFinish) onFinish();
    }, STARTUP_ANIMATION_MS + 150);

    return () => clearTimeout(fallback);
  }, [meColorProgress, onFinish, targetTranslateY, titleTranslateY]);

  useEffect(() => {
    if (dotVisible) {
      dotOpacity.value = withTiming(1, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      });
      dotScale.value = withTiming(1, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [dotVisible]);

  const titleContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const meStyle = useAnimatedStyle(() => ({
    color: interpolateColor(meColorProgress.value, [0, 1], ["#000", "#f1c40f"]),
  }));

  const dotSlotStyle = useAnimatedStyle(() => ({
    width: dotWidth.value,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  }));

  return (
    <View style={styles.overlay}>
      <View style={styles.centerContent}>
        <Animated.View style={titleContainerStyle}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Encendé</Text>
            <Animated.View style={dotSlotStyle}>
              {
                <Animated.Text
                  style={[styles.title, { color: GlobalStyles.disabledColor }]}
                >
                  .
                </Animated.Text>
              }
            </Animated.View>
            <Animated.Text style={[styles.title, meStyle]}>me</Animated.Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    zIndex: 9999,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
  },
});
