import ApiResponse from "@/types/ApiResponse";
import Device from "@/types/Device";
import { GetHandler } from "@/Utils/apiHandlers";

export async function GetDeviceList(): Promise<ApiResponse<Device[]>> {
  const response = await GetHandler<Device[]>("room/living");
  return response;
}
