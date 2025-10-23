import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Picker } from "@react-native-picker/picker";
import { Room } from "@/src/core/entities/Room";
import GlobalStyles from "@/Utils/globalStyles";
import useModeStore from "@/stores/useModeStore";
import useRooms from "@/hooks/useRooms";
import Loader from "./Loader";

export default function AppHeader() {
  const {
    saveEnergyMode,
    activityMode,
    changeSaveEnergyMode,
    changeActivityMode,
  } = useModeStore();

  const { currentRoom, rooms, isLoadingRooms, changeCurrentRoom } = useRooms();

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.statusBar} />
      <View style={styles.headerContainer}>
        {isLoadingRooms ? (
          <View
            style={{
              width: 150,
              justifyContent: "center",
            }}
          >
            <Loader size="small" />
          </View>
        ) : !currentRoom ? (
          <View style={{ width: 150 }}>
            <Text>No se encontro</Text>
          </View>
        ) : (
          <Picker
            selectedValue={currentRoom}
            style={{ width: 150 }}
            onValueChange={(itemValue: Room) => changeCurrentRoom(itemValue)}
          >
            {rooms.map((room) => (
              <Picker.Item label={room.name} key={room.name} value={room} />
            ))}
          </Picker>
        )}
        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.iconButton}
            onPress={() => changeSaveEnergyMode(!saveEnergyMode)}
          >
            <Feather
              name="battery-charging"
              size={22}
              color={saveEnergyMode ? GlobalStyles.enabledColor : "black"}
            />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => changeActivityMode(!activityMode)}
          >
            <Feather
              name="activity"
              size={22}
              color={activityMode ? GlobalStyles.enabledColor : "black"}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "#086ce5",
  },
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: "#086ce5",
  },
  headerContainer: {
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    flexDirection: "row",
  },
  iconButton: {
    /* paddingVertical: 8,
    paddingHorizontal: 16, */
    padding: 8,
    backgroundColor: "#fff",
    borderColor: "#dfe6e9",
    borderWidth: 1,
    borderStyle: "solid",
    flexDirection: "row",
    borderRadius: 100,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
