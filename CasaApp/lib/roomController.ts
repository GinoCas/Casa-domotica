import Room from "@/types/Room";
import Device from "@/types/Device";
import RoomData from "@/stores/rooms.json";
import { getDeviceList } from "./deviceController";

export function GetRoomsList(): string[] {
  return RoomData.map((room) => room.Name);
}

export function GetRoomByName(roomName: string): Room {
  const roomIndex = RoomData.findIndex(
    (room) => room.Name.toLowerCase() === roomName.toLowerCase(),
  );
  return RoomData[roomIndex] as Room;
}

export function GetRoomDevices(roomName: string): Device[] {
  const room = GetRoomByName(roomName);
  const roomDevices = getDeviceList().filter((device) =>
    room.DevicesId.includes(device.baseProperties.id),
  );
  console.log(roomDevices);
  return roomDevices;
}
