import Room from "@/types/Room";
import { Device } from "@/types/Device";
import { GetHandler } from "@/Utils/apiHandlers";
import { Result } from "@/types/Response";

export async function getRoomsList(): Promise<Result<string[]>> {
  return await GetHandler<string[]>("room/list");
}

export async function getRoomByName(roomName: string): Promise<Result<Room>> {
  return await GetHandler<Room>("room/" + roomName);
}

export async function getRoomDevices(roomName: string): Promise<Result<Device[]>> {
  return await GetHandler<Device[]>("room/" + roomName + "/devices");
}
