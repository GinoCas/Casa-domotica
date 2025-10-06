// Interfaz de repositorio para Device - Definida en el dominio
import { Result } from "@/src/shared/Result";
import { Device } from "../entities/Device";

export interface IDeviceRepository {
  getAll(): Promise<Result<Device[]>>;
  getById(id: number): Promise<Result<Device>>;
  updateDevice(
    deviceId: number,
    name: string,
    description: string,
  ): Promise<Result<boolean>>;
  addDeviceToRoom(roomId: number, deviceId: number): Promise<Result<boolean>>;
}

export interface IDeviceCommandRepository {
  setState(deviceId: number, state: boolean): Promise<Result<void>>;
  setBrightness(deviceId: number, brightness: number): Promise<Result<void>>;
  setSpeed(deviceId: number, speed: number): Promise<Result<void>>;
}
