// Implementación concreta del repositorio de Device
import { IDeviceRepository } from "../../core/repositories/IDeviceRepository";
import { Device } from "../../core/entities/Device";
import { Result } from "../../shared/Result";
import { HttpClient } from "../api/HttpClient";
import { DeviceDto } from "@/src/application/dtos/DeviceDto";
import { ArduinoDeviceDto } from "@/src/application/dtos/ArduinoDeviceDto";

export class ApiDeviceRepository implements IDeviceRepository {
  constructor(
    private httpClient: HttpClient,
    private localClient: HttpClient,
  ) {}

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
  async setState(deviceId: number, state: boolean): Promise<Result<boolean>> {
    return await this.executeCommand(deviceId, "SetState", { state });
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
    dto: DeviceDto,
  ): Promise<Result<boolean>> {
    console.log("DTO ENVIADO:", dto, " EN ID:", deviceId);
    const result = await this.httpClient.patch<boolean>(
      `device/${deviceId}/update`,
      dto,
    );
    console.log("Resultado:", result);

    if (!result.isSuccess) {
      return result as Result<boolean>;
    }

    return Result.success(result.data);
  }
  async controlDevice(dto: ArduinoDeviceDto): Promise<Result<boolean>> {
    console.log("DTO ENVIADO:", dto);
    let result = await this.localClient.put<boolean>(`device`, dto);
    if (!result.isSuccess) {
      console.log("No se pudo enviar localmente:", result);
      result = await this.httpClient.put<boolean>(`device/control`, dto);
    }
    console.log("Resultado:", result);

    if (!result.isSuccess) {
      return Result.failure(result.errors);
    }

    return Result.success(result.data);
  }
}
