import { roomService } from "@/src/services/RoomService";
import useRoomStore from "@/stores/useRoomStore";
import { useEffect } from "react";

export default function useRooms() {
  const {
    rooms,
    changeCurrentRoom,
    currentRoom,
    changeLoadingRooms,
    isLoadingRooms,
    handleLoadRooms,
  } = useRoomStore();

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
  }, [changeCurrentRoom, changeLoadingRooms, handleLoadRooms]);

  return { rooms, currentRoom, isLoadingRooms, changeCurrentRoom };
}
