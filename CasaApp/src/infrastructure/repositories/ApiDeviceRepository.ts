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
    return await this.httpClient.get<Device[]>("device/list");
  }

  async getById(id: number): Promise<Result<Device>> {
    return await this.httpClient.get<Device>(`device/${id}`);
  }

  async executeCommand(
    deviceId: number,
    command: string,
    parameters?: Record<string, any>,
  ): Promise<Result<boolean>> {
    const commandDto = {
      deviceId,
      commandName: command,
      parameters: parameters ?? {},
    };

    const result = await this.httpClient.post<boolean>(
      "device/execute",
      commandDto,
    );

    if (!result.isSuccess) {
      return result as Result<boolean>;
    }

    return Result.success(result.data);
  }

  // Implementación de IDeviceCommandRepository
  async setState(deviceId: number, state: boolean): Promise<Result<void>> {
    const commandDto = CommandDtoFactory.createStateCommand(deviceId, state);
    return await this.httpClient.post<void>("device/execute", commandDto);
  }

  async setBrightness(
    deviceId: number,
    brightness: number,
  ): Promise<Result<boolean>> {
    return await this.executeCommand(deviceId, "SetBrightness", { brightness });
  }

  async setSpeed(deviceId: number, speed: number): Promise<Result<boolean>> {
    return await this.executeCommand(deviceId, "SetSpeed", { speed });
  }

  async updateDevice(
    deviceId: number,
    name: string,
    description: string,
  ): Promise<Result<boolean>> {
    const result = await this.httpClient.put<boolean>(
      `device/${deviceId}/update`,
      {
        name,
        description,
      },
    );

    if (!result.isSuccess) {
      return result as Result<boolean>;
    }

    return Result.success(result.data);
  }

  async addDeviceToRoom(
    roomId: number,
    deviceId: number,
  ): Promise<Result<boolean>> {
    const result = await this.httpClient.post<boolean>(
      `room/${roomId}/device`,
      {
        deviceId,
      },
    );

    if (!result.isSuccess) {
      return result as Result<boolean>;
    }

    return Result.success(result.data);
  }
}
