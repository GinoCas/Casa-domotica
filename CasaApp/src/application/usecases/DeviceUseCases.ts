// Casos de uso para Device
import { Device } from "../../core/entities/Device";
import { IDeviceRepository } from "../../core/repositories/IDeviceRepository";
import { Result } from "../../shared/Result";
import { ArduinoDeviceDto } from "../dtos/ArduinoDeviceDto";
import { DeviceDto } from "../dtos/DeviceDto";

export class GetDeviceListUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(): Promise<Result<Device[]>> {
    try {
      return await this.deviceRepository.getAll();
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}

export class GetDeviceByIdUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(id: number): Promise<Result<Device>> {
    try {
      if (id <= 0) {
        return Result.failure(["Device ID must be greater than 0"]);
      }
      return await this.deviceRepository.getById(id);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}

export class UpdateDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number, dto: DeviceDto): Promise<Result<boolean>> {
    return await this.deviceRepository.updateDevice(deviceId, dto);
  }
}

export class ControlDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(dto: ArduinoDeviceDto): Promise<Result<boolean>> {
    try {
      if (dto.Id <= 0) {
        return Result.failure(["Device ID must be greater than 0"]);
      }

      return await this.deviceRepository.controlDevice(dto);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}
