import ApiResponse from "@/types/ApiResponse";
import Device from "@/types/Device";
import { GetHandler } from "@/Utils/apiHandlers";

interface Response {
  Id: number;
  Name: string;
  Devices: Device[];
}

export async function GetDeviceList(
  roomName: string,
): Promise<ApiResponse<Response[]>> {
  const response = await GetHandler<Response[]>(`room/${roomName}`);
  return response;
}
