export function getGlobalStyles() {
  const disabledColor = "#b7b8b9";
  const enabledColor = "#086ce5";
  return {
    semibold: {
      fontWeight: "600",
    },
    disabledText: {
      color: disabledColor,
    },
    disabledColor: disabledColor,
    enabledText: {
      color: enabledColor,
    },
    enabledColor: enabledColor,
  };
}
