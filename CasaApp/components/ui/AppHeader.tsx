import { Pressable, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { GetRoomsList } from "@/lib/roomController";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import useRoomStore from "@/stores/useRoomStore";
import Loader from "./Loader";

export default function AppHeader() {
  const rooms: string[] = GetRoomsList();

  const { changeCurrentRoom, roomName, changeLoadingRooms, isLoadingRooms } =
    useRoomStore();

  useEffect(() => {
    const getAllRoms = async () => {
      changeLoadingRooms(true);
      try {
        changeCurrentRoom(rooms[0]);
      } catch (err) {
        console.log("errorr loading rooms", err);
      } finally {
        changeLoadingRooms(false);
      }
    };
    getAllRoms();
  }, [changeCurrentRoom, changeLoadingRooms]);

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
        <Pressable style={styles.iconButton}>
          <FontAwesome5 name="lightbulb" size={22} color="black" />
        </Pressable>

        <Pressable style={styles.iconButton}>
          <FontAwesome5 name="user" size={22} color="black" />
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
