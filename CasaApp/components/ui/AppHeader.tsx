import { StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";

export default function AppHeader() {
  return (
    <View style={styles.headerContainer}>
      <Text>WIP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: Constants.statusBarHeight,
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#aaa",
    flexDirection: "row",
  },
});
