import { Device } from "@/types/Device";
import Room from "@/types/Room";
import { Result } from "@/types/Response";
import {
  getRoomByName,
  getRoomDevicesId,
  getRoomNamesList,
} from "@/lib/roomController";
import useDeviceStore from "@/stores/useDeviceStore";

export const roomService = {
  getRoomsList: async (): Promise<Result<string[]>> => {
    return await getRoomNamesList();
  },

  getRoomByName: async (roomName: string): Promise<Result<Room>> => {
    return await getRoomByName(roomName);
  },

  getRoomDevices: async (roomName: string): Promise<Result<Device[]>> => {
    const ids = await getRoomDevicesId(roomName);
    if (!ids.isSuccess) {
      return Result.failure(ids.errors);
    }
    const dev = useDeviceStore.getState().devices;
    return Result.success(dev.filter((d) => ids.data.includes(d.id)));
  },
};
