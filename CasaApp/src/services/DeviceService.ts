// Servicio de Device usando Clean Architecture
import { Device } from "../core/entities/Device";
import { Result } from "../shared/Result";
import { DependencyContainer } from "../shared/DependencyContainer";

export class DeviceService {
  private container = DependencyContainer.getInstance();

  async getDeviceList(): Promise<Result<Device[]>> {
    const useCase = this.container.getGetDeviceListUseCase();
    return await useCase.execute();
  }

  async getDeviceById(id: number): Promise<Result<Device>> {
    const useCase = this.container.getGetDeviceByIdUseCase();
    return await useCase.execute(id);
  }

  async setDeviceState(
    deviceId: number,
    state: boolean,
  ): Promise<Result<void>> {
    const useCase = this.container.getSetDeviceStateUseCase();
    return await useCase.execute(deviceId, state);
  }

  async setBrightness(
    deviceId: number,
    brightness: number,
  ): Promise<Result<void>> {
    const useCase = this.container.getSetDeviceBrightnessUseCase();
    return await useCase.execute(deviceId, brightness);
  }

  async setSpeed(deviceId: number, speed: number): Promise<Result<void>> {
    const useCase = this.container.getSetDeviceSpeedUseCase();
    return await useCase.execute(deviceId, speed);
  }
}

export const deviceService = new DeviceService();
