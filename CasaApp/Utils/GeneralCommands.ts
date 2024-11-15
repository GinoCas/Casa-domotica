import { UpdateDevice } from "@/lib/deviceController";
import { GetRoomDevices } from "@/lib/roomController";

export function TurnOnAllLedsOfRoom(roomName: string) {
  GetRoomDevices(roomName).forEach((device) => {
    const updatedDevice = device;
    updatedDevice.baseProperties.state = true;
    UpdateDevice(updatedDevice);
  });
}

export function TurnOffAllLedsOfRoom(roomName: string) {
  GetRoomDevices(roomName).forEach((device) => {
    const updatedDevice = device;
    updatedDevice.baseProperties.state = false;
    UpdateDevice(device);
  });
}
