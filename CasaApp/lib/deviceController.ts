import ApiResponse from "@/types/ApiResponse";
import Room from "@/types/Device";
import { GetHandler } from "@/Utils/apiHandlers";

export async function GetDeviceList(): Promise<ApiResponse<Room[]>> {
  const response = await GetHandler<Room[]>("room/living");
  return response;
}
