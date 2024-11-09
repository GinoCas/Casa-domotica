import ApiResponse from "@/types/ApiResponse";
import Device from "@/types/Device";
import { GetHandler, PutHandler } from "@/Utils/apiHandlers";

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

export async function UpdateDevice(body: Device) {
  const response = await PutHandler<any[]>("room/update", body);
  return response;
}
