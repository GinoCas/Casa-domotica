import ApiResponse from "@/types/ApiResponse";
import Device from "@/types/Device";
import { GetHandler, PutHandler } from "@/Utils/apiHandlers";

export async function GetDeviceList(
  roomName: string,
): Promise<ApiResponse<Response[]>> {
  const response = await GetHandler<Response[]>(`device/list`);
  return response;
}

export async function UpdateDevice(body: Device) {
  const response = await PutHandler<any[]>("device/update", body);
  return response;
}
