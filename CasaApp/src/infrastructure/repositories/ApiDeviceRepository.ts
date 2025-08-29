// Implementación concreta del repositorio de Device
import {
  IDeviceRepository,
  IDeviceCommandRepository,
} from "../../core/repositories/IDeviceRepository";
import { Device } from "../../core/entities/Device";
import { Result } from "../../shared/Result";
import { HttpClient } from "../api/HttpClient";
import { CommandDtoFactory } from "../../application/dtos/CommandDto";

export class ApiDeviceRepository
  implements IDeviceRepository, IDeviceCommandRepository
{
  constructor(private httpClient: HttpClient) {}

  async getAll(): Promise<Result<Device[]>> {
    const result = await this.httpClient.get<any[]>("device/list");

    if (!result.isSuccess) {
      return result as Result<Device[]>;
    }

    try {
      const devices = result.data;

      return Result.success(devices);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }

  async getById(id: number): Promise<Result<Device>> {
    const result = await this.httpClient.get<any>(`device/${id}`);

    if (!result.isSuccess) {
      return result as Result<Device>;
    }

    try {
      const device = result.data;
      return Result.success(device);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }

  async executeCommand(
    deviceId: number,
    command: string,
    parameters?: Record<string, any>,
  ): Promise<Result<void>> {
    const commandDto = {
      deviceId,
      commandName: command,
      parameters: parameters ?? {},
    };

    const result = await this.httpClient.post<any>(
      "device/execute",
      commandDto,
    );

    if (!result.isSuccess) {
      return result as Result<void>;
    }

    return Result.success(undefined);
  }

  // Implementación de IDeviceCommandRepository
  async setState(deviceId: number, state: boolean): Promise<Result<void>> {
    const commandDto = CommandDtoFactory.createStateCommand(deviceId, state);
    return await this.httpClient.post<void>("device/execute", commandDto);
  }

  async setBrightness(
    deviceId: number,
    brightness: number,
  ): Promise<Result<void>> {
    const commandDto = CommandDtoFactory.createBrightnessCommand(
      deviceId,
      brightness,
    );
    return await this.httpClient.post<void>("device/execute", commandDto);
  }

  async setSpeed(deviceId: number, speed: number): Promise<Result<void>> {
    const commandDto = CommandDtoFactory.createSpeedCommand(deviceId, speed);
    return await this.httpClient.post<void>("device/execute", commandDto);
  }
}
