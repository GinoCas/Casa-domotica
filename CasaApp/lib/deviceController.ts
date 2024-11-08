import ApiResponse from "@/types/ApiResponse";
import Device from "@/types/Device";
import { GetHandler } from "@/Utils/apiHandlers";

export async function GetDeviceList(
  roomName: string,
): Promise<ApiResponse<Device[]>> {
  const response = await GetHandler<Device[]>(`room/${roomName}`);
  return response;
}
