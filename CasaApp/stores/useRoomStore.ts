import { Room } from "@/src/core/entities/Room";
import { roomService } from "@/src/services/RoomService";
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
  addDeviceToRoom: (roomId: number, deviceId: number) => Promise<void>;
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
  addDeviceToRoom: async (roomId, deviceId) => {
    var currentDeviceRoom = get().rooms.find((room) =>
      room.deviceIds.includes(deviceId),
    );
    if (currentDeviceRoom && currentDeviceRoom.id === roomId) {
      return;
    }
    try {
      set({ isLoadingRooms: true });
      const result = await roomService.addDeviceToRoom(roomId, deviceId);
      if (!result.isSuccess) {
        throw new Error(result.errors.join(", "));
      }
      const roomResult = await roomService.getAllRooms();
      if (!roomResult.isSuccess) {
        throw new Error(result.errors.join(", "));
      }
      set({ rooms: roomResult.data });
    } catch (error) {
      console.error(
        "Ocurrió un error al agregar el dispositivo a la habitacion:",
        error,
      );
    } finally {
      set({ isLoadingRooms: false });
    }
  },
}));

export default useRoomStore;
