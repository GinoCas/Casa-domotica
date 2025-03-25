import Room from "@/types/Room";
import { Device } from "@/types/Device";
import RoomData from "@/stores/rooms.json";
import { getDeviceList } from "./deviceController";

export function getRoomsList(): string[] {
  return RoomData.map((room) => room.Name);
}

export function getRoomByName(roomName: string): Room {
  const roomIndex = RoomData.findIndex(
    (room) => room.Name.toLowerCase() === roomName.toLowerCase(),
  );
  return RoomData[roomIndex] as Room;
}

export function getRoomDevices(roomName: string): Device[] {
  const room = getRoomByName(roomName);
  const roomDevices = getDeviceList().filter((device) =>
    room.DevicesId.includes(device.id),
  );
  console.log(roomDevices);
  return roomDevices;
}
