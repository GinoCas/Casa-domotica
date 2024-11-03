import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, Pressable } from "react-native";
import { getGlobalStyles } from "../lib/globalStyles";

export function Switch({ isEnabled, setIsEnabled }) {
  const animation = useRef(new Animated.Value(isEnabled ? 26 : 2)).current;
  const globalStyles = getGlobalStyles();
  const toggleSwitch = () => setIsEnabled((prev) => !prev);

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
            ? globalStyles.enabledColor
            : globalStyles.disabledColor,
        },
      ]}
      onPress={toggleSwitch}
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
