import { Device } from "@/types/Device";
import { Result } from "@/types/Response";
import {
  getDeviceById,
  getDeviceList,
  setBrightness,
  setDeviceState,
  setSpeed,
} from "@/lib/deviceController";

export const deviceService = {
  getDeviceList: async (): Promise<Result<Device[]>> => {
    return await getDeviceList();
  },

  getDeviceById: async (id: number): Promise<Result<Device>> => {
    return await getDeviceById(id);
  },

  setDeviceState: async (
    deviceId: number,
    state: boolean,
  ): Promise<Result<any>> => {
    return await setDeviceState(deviceId, state);
  },

  setBrightness: async (
    deviceId: number,
    brightness: number,
  ): Promise<Result<any>> => {
    return await setBrightness(deviceId, brightness);
  },

  setSpeed: async (deviceId: number, speed: number): Promise<Result<any>> => {
    return await setSpeed(deviceId, speed);
  },
};
