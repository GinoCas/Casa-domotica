import ApiResponse from "@/types/ApiResponse";
import { GetHandler } from "@/Utils/apiHandlers";

export async function GetRoomsList(): Promise<ApiResponse<string[]>> {
  const roomsResponse = await GetHandler<string[]>("rooms");
  return roomsResponse;
}

export async function GetRoomByName(
  roomName: string,
): Promise<ApiResponse<Response[]>> {
  const response = await GetHandler<Response[]>(`room/${roomName}`);
  return response;
}
