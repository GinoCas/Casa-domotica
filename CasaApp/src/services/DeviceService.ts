// Servicio de Device usando Clean Architecture
import { Device } from "../core/entities/Device";
import { Result } from "../shared/Result";
import { DependencyContainer } from "../shared/DependencyContainer";
import { DeviceDto } from "../application/dtos/DeviceDto";
import { ArduinoDeviceDto } from "../application/dtos/ArduinoDeviceDto";

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

  async updateDevice(
    deviceId: number,
    dto: DeviceDto,
  ): Promise<Result<boolean>> {
    const useCase = this.container.getUpdateDeviceUseCase();
    return await useCase.execute(deviceId, dto);
  }

  async controlDevice(dto: ArduinoDeviceDto): Promise<Result<boolean>> {
    const useCase = this.container.getControlDeviceUseCase();
    return await useCase.execute(dto);
  }
}

export const deviceService = new DeviceService();
