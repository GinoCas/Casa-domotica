import { Room } from "@/src/core/entities/Room";
import { Result } from "@/src/shared/Result";
import { create } from "zustand";

interface RoomState {
  rooms: Room[];
  currentRoom: Room | undefined;
  isLoadingRooms: boolean;
  handleLoadRooms: (rooms: Room[]) => void;
  changeCurrentRoom: (newRoom: Room) => void;
  changeLoadingRooms: (newState: boolean) => void;
  getRoomByName: (roomName: string) => Result<Room>;
}

const useRoomStore = create<RoomState>()((set, get) => ({
  rooms: [],
  currentRoom: undefined,
  changeCurrentRoom: (newRoom: Room) =>
    set((state) => ({ ...state, currentRoom: newRoom })),
  isLoadingRooms: false,
  changeLoadingRooms: (newState) =>
    set((state) => ({ ...state, isLoadingRooms: newState })),
  handleLoadRooms: (newRooms: Room[]) => {
    set((state) => ({ ...state, rooms: newRooms }));
  },
  getRoomByName: (name: string) => {
    const room = get().rooms.find((item) => item.name === name);
    if (room === undefined) {
      return Result.failure([
        "La habitacion con el nombre: " + name + " no fue encontrada",
      ]);
    }
    return Result.success(room);
  },
}));

export default useRoomStore;
