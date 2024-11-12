import ApiResponse from "@/types/ApiResponse";
import Room from "@/types/Room";
import { GetHandler } from "@/Utils/apiHandlers";
import RoomData from "@/stores/rooms.json";

export function GetRoomsList(): string[] {
  return RoomData.map((room) => room.Name);
}

export function GetRoomByName(roomName: string): Room {
  return RoomData.find((room) => room.Name === roomName) as Room;
}
