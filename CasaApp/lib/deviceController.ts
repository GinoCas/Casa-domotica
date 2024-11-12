import ApiResponse from "@/types/ApiResponse";
import Device from "@/types/Device";
import { GetHandler, PutHandler } from "@/Utils/apiHandlers";
import DevicesData from "@/stores/devices.json";

export function GetDeviceList(): Device[] {
  return DevicesData as Device[];
}

export async function UpdateDevice(body: Device) {
  const response = await PutHandler<any[]>("device/update", body);
  return response;
}
