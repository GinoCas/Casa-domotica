// Container de dependencias - Implementación simple
import { HttpClient } from "../infrastructure/api/HttpClient";
import { ApiDeviceRepository } from "../infrastructure/repositories/ApiDeviceRepository";
import { ApiRoomRepository } from "../infrastructure/repositories/ApiRoomRepository";
import {
  GetDeviceListUseCase,
  GetDeviceByIdUseCase,
  SetDeviceStateUseCase,
  SetDeviceBrightnessUseCase,
  SetDeviceSpeedUseCase,
} from "../application/usecases/DeviceUseCases";
import {
  GetRoomNamesUseCase,
  GetRoomByNameUseCase,
  GetDevicesByRoomNameUseCase,
} from "../application/usecases/RoomUseCases";
import { ApiAutomationRepository } from "../infrastructure/repositories/ApiAutomationRepository";
import {
  CreateAutomationUseCase,
  DeleteAutomationUseCase,
  GetAllAutomationsUseCase,
  GetAutomationByIdUseCase,
  UpdateAutomationUseCase,
} from "../application/usecases/AutomationUseCases";

export class DependencyContainer {
  private static instance: DependencyContainer;
  private httpClient: HttpClient;
  private deviceRepository: ApiDeviceRepository;
  private roomRepository: ApiRoomRepository;
  private automationRepository: ApiAutomationRepository;

  // Use cases
  private getDeviceListUseCase: GetDeviceListUseCase;
  private getDeviceByIdUseCase: GetDeviceByIdUseCase;
  private setDeviceStateUseCase: SetDeviceStateUseCase;
  private setDeviceBrightnessUseCase: SetDeviceBrightnessUseCase;
  private setDeviceSpeedUseCase: SetDeviceSpeedUseCase;
  private getRoomNamesUseCase: GetRoomNamesUseCase;
  private getRoomByNameUseCase: GetRoomByNameUseCase;
  private getDevicesByRoomNameUseCase: GetDevicesByRoomNameUseCase;
  private getAllAutomationsUseCase: GetAllAutomationsUseCase;
  private getAutomationByIdUseCase: GetAutomationByIdUseCase;
  private createAutomationUseCase: CreateAutomationUseCase;
  private deleteAutomationUseCase: DeleteAutomationUseCase;
  private updateAutomationUseCase: UpdateAutomationUseCase;

  private constructor() {
    // Configuración de la URL base desde las variables de entorno
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5155";

    // Inicialización de dependencias
    this.httpClient = new HttpClient(apiUrl);
    this.deviceRepository = new ApiDeviceRepository(this.httpClient);
    this.roomRepository = new ApiRoomRepository(this.httpClient);
    this.automationRepository = new ApiAutomationRepository(this.httpClient);

    // Inicialización de casos de uso
    this.getDeviceListUseCase = new GetDeviceListUseCase(this.deviceRepository);
    this.getDeviceByIdUseCase = new GetDeviceByIdUseCase(this.deviceRepository);
    this.setDeviceStateUseCase = new SetDeviceStateUseCase(
      this.deviceRepository,
    );
    this.setDeviceBrightnessUseCase = new SetDeviceBrightnessUseCase(
      this.deviceRepository,
    );
    this.setDeviceSpeedUseCase = new SetDeviceSpeedUseCase(
      this.deviceRepository,
    );
    this.getRoomNamesUseCase = new GetRoomNamesUseCase(this.roomRepository);
    this.getRoomByNameUseCase = new GetRoomByNameUseCase(this.roomRepository);
    this.getDevicesByRoomNameUseCase = new GetDevicesByRoomNameUseCase(
      this.roomRepository,
    );
    this.getAllAutomationsUseCase = new GetAllAutomationsUseCase(
      this.automationRepository,
    );
    this.getAutomationByIdUseCase = new GetAutomationByIdUseCase(
      this.automationRepository,
    );
    this.createAutomationUseCase = new CreateAutomationUseCase(
      this.automationRepository,
    );
    this.deleteAutomationUseCase = new DeleteAutomationUseCase(
      this.automationRepository,
    );
    this.updateAutomationUseCase = new UpdateAutomationUseCase(
      this.automationRepository,
    );
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  // Getters para casos de uso de Device
  public getGetDeviceListUseCase(): GetDeviceListUseCase {
    return this.getDeviceListUseCase;
  }

  public getGetDeviceByIdUseCase(): GetDeviceByIdUseCase {
    return this.getDeviceByIdUseCase;
  }

  public getSetDeviceStateUseCase(): SetDeviceStateUseCase {
    return this.setDeviceStateUseCase;
  }

  public getSetDeviceBrightnessUseCase(): SetDeviceBrightnessUseCase {
    return this.setDeviceBrightnessUseCase;
  }

  public getSetDeviceSpeedUseCase(): SetDeviceSpeedUseCase {
    return this.setDeviceSpeedUseCase;
  }

  // Getters para casos de uso de Room
  public getGetRoomNamesUseCase(): GetRoomNamesUseCase {
    return this.getRoomNamesUseCase;
  }

  public getGetRoomByNameUseCase(): GetRoomByNameUseCase {
    return this.getRoomByNameUseCase;
  }

  public getGetDevicesByRoomNameUseCase(): GetDevicesByRoomNameUseCase {
    return this.getDevicesByRoomNameUseCase;
  }

  // Getters para casos de uso de Automation
  public getGetAllAutomationsUseCase(): GetAllAutomationsUseCase {
    return this.getAllAutomationsUseCase;
  }

  public getGetAutomationByIdUseCase(): GetAutomationByIdUseCase {
    return this.getAutomationByIdUseCase;
  }

  public getCreateAutomationUseCase(): CreateAutomationUseCase {
    return this.createAutomationUseCase;
  }

  public getDeleteAutomationUseCase(): DeleteAutomationUseCase {
    return this.deleteAutomationUseCase;
  }

  public getUpdateAutomationUseCase(): UpdateAutomationUseCase {
    return this.updateAutomationUseCase;
  }
}
