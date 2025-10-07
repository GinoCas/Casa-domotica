// Casos de uso para Device
import { Device } from "../../core/entities/Device";
import {
  IDeviceRepository,
  IDeviceCommandRepository,
} from "../../core/repositories/IDeviceRepository";
import { Result } from "../../shared/Result";
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

export class AddDeviceToRoomUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(roomId: number, deviceId: number): Promise<Result<boolean>> {
    return await this.deviceRepository.addDeviceToRoom(roomId, deviceId);
  }
}

export class SetDeviceStateUseCase {
  constructor(private deviceCommandRepository: IDeviceCommandRepository) {}

  async execute(deviceId: number, state: boolean): Promise<Result<void>> {
    try {
      if (deviceId <= 0) {
        return Result.failure(["Device ID must be greater than 0"]);
      }
      return await this.deviceCommandRepository.setState(deviceId, state);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}

export class SetDeviceBrightnessUseCase {
  constructor(private commandRepository: IDeviceCommandRepository) {}

  async execute(deviceId: number, brightness: number): Promise<Result<void>> {
    try {
      if (deviceId <= 0) {
        return Result.failure(["Device ID must be greater than 0"]);
      }
      if (brightness < 0 || brightness > 100) {
        return Result.failure(["Brightness must be between 0 and 100"]);
      }
      return await this.commandRepository.setBrightness(deviceId, brightness);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}

export class SetDeviceSpeedUseCase {
  constructor(private commandRepository: IDeviceCommandRepository) {}

  async execute(deviceId: number, speed: number): Promise<Result<void>> {
    try {
      if (deviceId <= 0) {
        return Result.failure(["Device ID must be greater than 0"]);
      }
      if (speed < 0 || speed > 100) {
        return Result.failure(["Speed must be between 0 and 100"]);
      }
      return await this.commandRepository.setSpeed(deviceId, speed);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}
