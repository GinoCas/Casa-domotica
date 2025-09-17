import { Pressable, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { Picker } from "@react-native-picker/picker";
import { useEffect } from "react";
import useRoomStore from "@/stores/useRoomStore";
import Loader from "./Loader";
import { Feather } from "@expo/vector-icons";
import GlobalStyles from "@/Utils/globalStyles";
import useModeStore from "@/stores/useModeStore";
import { turnOnLedRandom } from "@/Utils/GeneralCommands";
import { roomService } from "@/src/services/RoomService";
import { Text } from "react-native-svg";
import { Room } from "@/src/core/entities/Room";

export default function AppHeader() {
  const {
    saveEnergyMode,
    activityMode,
    changeSaveEnergyMode,
    changeActivityMode,
  } = useModeStore();

  const {
    rooms,
    changeCurrentRoom,
    currentRoom,
    changeLoadingRooms,
    isLoadingRooms,
    handleLoadRooms,
    getRoomByName,
  } = useRoomStore();

  const toggleEnergySaveMode = () => {
    changeSaveEnergyMode(!saveEnergyMode);
    if (saveEnergyMode) return;
    //UpdateAllLeds();
  };

  useEffect(() => {
    const getAllRooms = async () => {
      changeLoadingRooms(true);
      const roomsResult = await roomService.getAllRooms();
      if (!roomsResult.isSuccess) {
        console.log("error loading rooms", roomsResult.errors);
        changeLoadingRooms(false);
        return;
      }
      changeCurrentRoom(roomsResult.data[0]);
      handleLoadRooms(roomsResult.data);
      changeLoadingRooms(false);
    };
    getAllRooms();
  }, [changeCurrentRoom, changeLoadingRooms]);

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
