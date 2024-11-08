import ApiResponse from "@/types/ApiResponse";
import { GetHandler } from "@/Utils/apiHandlers";

export async function GetRoomsList(): Promise<ApiResponse<string[]>> {
  const roomsResponse = await GetHandler<string[]>("rooms");
  return roomsResponse;
}
