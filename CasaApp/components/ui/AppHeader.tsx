import { Pressable, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { GetRoomsList } from "@/lib/roomController";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function AppHeader() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    const getAllRoms = async () => {
      const roomsResult = await GetRoomsList();
      const roomsList = roomsResult.data;
      setRooms(roomsList);
      setSelectedRoom(roomsList[0]);
    };
    getAllRoms();
  }, []);

  return (
    <View style={styles.headerContainer}>
      <Picker
        selectedValue={selectedRoom}
        style={{ width: 150 }}
        onValueChange={(itemValue) => setSelectedRoom(itemValue)}
      >
        {rooms.map((room) => (
          <Picker.Item label={room} key={room} value={room} />
        ))}
      </Picker>
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
