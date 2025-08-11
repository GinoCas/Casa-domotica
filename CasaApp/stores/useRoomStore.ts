import { Device } from "@/types/Device";
import { create } from "zustand";

interface RoomState {
  roomName: string;
  roomDevices: Device[];
  handleLoadRoomDevices: (newDevices: Device[]) => void;
  changeCurrentRoom: (newRoom: string) => void;
  isLoadingRooms: boolean;
  isLoadingRoomDevices: boolean;
  changeLoadingRooms: (newState: boolean) => void;
  changeLoadingRoomDevices: (newState: boolean) => void;
}

const useRoomStore = create<RoomState>()((set) => ({
  roomDevices: [],
  roomName: "",
  handleLoadRoomDevices: (newDevices) =>
    set((state) => ({ ...state, roomDevices: newDevices })),
  changeCurrentRoom: (newRoom) =>
    set((state) => ({ ...state, roomName: newRoom })),
  isLoadingRoomDevices: false,
  isLoadingRooms: false,
  changeLoadingRoomDevices: (newState) =>
    set((state) => ({ ...state, isLoadingRoomDevices: newState })),
  changeLoadingRooms: (newState) =>
    set((state) => ({ ...state, isLoadingRooms: newState }))
}));

export default useRoomStore;
