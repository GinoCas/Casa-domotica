import Room from "@/types/Room";
import { GetHandler } from "@/Utils/apiHandlers";
import { Result } from "@/types/Response";

export async function getRoomNamesList(): Promise<Result<string[]>> {
  return await GetHandler<string[]>("room/names");
}

export async function getRoomByName(roomName: string): Promise<Result<Room>> {
  return await GetHandler<Room>("room/" + roomName);
}

export async function getRoomDevicesId(
  roomName: string,
): Promise<Result<number[]>> {
  return await GetHandler<number[]>("room/" + roomName + "/devices");
}
