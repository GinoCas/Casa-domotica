import { Device } from "@/types/Device";
import Room from "@/types/Room";
import { Result } from "@/types/Response";
import { getRoomByName, getRoomDevices, getRoomsList } from "@/lib/roomController";

export const roomService = {
  getRoomsList: async (): Promise<Result<string[]>> => {
    return await getRoomsList();
  },
  
  getRoomByName: async (roomName: string): Promise<Result<Room>> => {
    return await getRoomByName(roomName);
  },
  
  getRoomDevices: async (roomName: string): Promise<Result<Device[]>> => {
    return await getRoomDevices(roomName);
  }
};