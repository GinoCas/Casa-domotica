import GlobalStyles from "@/Utils/globalStyles";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, Pressable } from "react-native";

export function Switch({
  isEnabled,
  toggleEnabled,
  disabled,
}: {
  isEnabled: boolean;
  toggleEnabled: () => void;
  disabled?: boolean;
}) {
  const animation = useRef(new Animated.Value(isEnabled ? 26 : 2)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isEnabled ? 26 : 4,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [animation, isEnabled]);

  return (
    <Pressable
      style={[
        styles.track,
        {
          backgroundColor: isEnabled
            ? GlobalStyles.enabledColor
            : GlobalStyles.disabledColor,
        },
      ]}
      disabled={disabled}
      onPress={() => {
        if (!disabled) toggleEnabled();
      }}
    >
      <Animated.View
        style={[styles.thumb, { transform: [{ translateX: animation }] }]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 25,
    borderRadius: 15,
    padding: 2,
    justifyContent: "center",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    position: "absolute",
  },
});
