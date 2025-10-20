import { Result } from "@/src/shared/Result";
import { Device } from "../entities/Device";
import { DeviceDto } from "@/src/application/dtos/DeviceDto";
import { ArduinoDeviceDto } from "@/src/application/dtos/ArduinoDeviceDto";

export interface IDeviceRepository {
  getAll(): Promise<Result<Device[]>>;
  getById(id: number): Promise<Result<Device>>;
  updateDevice(deviceId: number, dto: DeviceDto): Promise<Result<boolean>>;
  controlDevice(dtos: ArduinoDeviceDto[]): Promise<Result<boolean>>;
}
