import { UpdateDevice } from "@/lib/deviceController";
import { GetRoomDevices } from "@/lib/roomController";

export function TurnOnAllLedsOfRoom(roomName: string) {
  GetRoomDevices(roomName).forEach((device) => {
    UpdateDevice(device);
  });
}

export function TurnOffAllLedsOfRoom(roomName: string) {
  GetRoomDevices(roomName).forEach((device) => {
    UpdateDevice(device);
  });
}
