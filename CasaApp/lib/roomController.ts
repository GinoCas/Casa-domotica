import ApiResponse from "@/types/ApiResponse";
import Room from "@/types/Room";
import { GetHandler } from "@/Utils/apiHandlers";

export async function GetRoomsList(): Promise<ApiResponse<string[]>> {
  const roomsResponse = await GetHandler<string[]>("rooms");
  return roomsResponse;
}

export async function GetRoomByName(
  roomName: string,
): Promise<ApiResponse<Room[]>> {
  const response = await GetHandler<Room[]>(`room/${roomName}`);
  return response;
}
