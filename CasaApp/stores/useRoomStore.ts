import { Device } from "@/types/Device";
import { create } from "zustand";

interface RoomState {
  roomName: string;
  devices: Device[];
  handleLoadDevices: (newDevices: Device[]) => void;
  changeCurrentRoom: (newRoom: string) => void;
  isLoadingRooms: boolean;
  isLoadingDevices: boolean;
  changeLoadingRooms: (newState: boolean) => void;
  changeLoadingDevices: (newState: boolean) => void;
}

const useRoomStore = create<RoomState>()((set) => ({
  devices: [],
  roomName: "",
  handleLoadDevices: (newDevices) =>
    set((state) => ({ ...state, devices: newDevices })),
  changeCurrentRoom: (newRoom) =>
    set((state) => ({ ...state, roomName: newRoom })),
  isLoadingDevices: false,
  isLoadingRooms: false,
  changeLoadingDevices: (newState) =>
    set((state) => ({ ...state, isLoadingDevices: newState })),
  changeLoadingRooms: (newState) =>
    set((state) => ({ ...state, isLoadingRooms: newState })),
}));

export default useRoomStore;
