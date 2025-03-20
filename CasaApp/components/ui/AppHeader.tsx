import { Pressable, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { Picker } from "@react-native-picker/picker";
import { useEffect } from "react";
import { getRoomsList } from "@/lib/roomController";
import useRoomStore from "@/stores/useRoomStore";
import Loader from "./Loader";
import { Feather } from "@expo/vector-icons";
import GlobalStyles from "@/Utils/globalStyles";
import useModeStore from "@/stores/useModeStore";
import { UpdateAllLeds } from "@/lib/deviceController";
import { turnOnLedRandom } from "@/Utils/GeneralCommands";

export default function AppHeader() {
  const {
    saveEnergyMode,
    activityMode,
    changeSaveEnergyMode,
    changeActivityMode,
  } = useModeStore();
  const rooms: string[] = getRoomsList();
  const { changeCurrentRoom, roomName, changeLoadingRooms, isLoadingRooms } =
    useRoomStore();
  const toggleEnergySaveMode = () => {
    changeSaveEnergyMode(!saveEnergyMode);
    if (saveEnergyMode) return;
    UpdateAllLeds();
  };

  useEffect(() => {
    const getAllRoms = async () => {
      changeLoadingRooms(true);
      try {
        changeCurrentRoom(rooms[0]);
      } catch (err) {
        console.log("error loading rooms", err);
      } finally {
        changeLoadingRooms(false);
      }
    };
    getAllRoms();
  }, [changeCurrentRoom, changeLoadingRooms, rooms]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activityMode) {
      turnOnLedRandom();
      interval = setInterval(() => {
        turnOnLedRandom();
      }, 10000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activityMode]);

  return (
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
      ) : (
        <Picker
          selectedValue={roomName}
          style={{ width: 150 }}
          onValueChange={(itemValue) => changeCurrentRoom(itemValue)}
        >
          {rooms.map((room) => (
            <Picker.Item label={room} key={room} value={room} />
          ))}
        </Picker>
      )}
      <View style={styles.actionsContainer}>
        <Pressable
          style={styles.iconButton}
          onPress={() => toggleEnergySaveMode()}
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
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: Constants.statusBarHeight,
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
