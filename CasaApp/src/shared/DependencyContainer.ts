// Container de dependencias - Implementación simple
import { HttpClient } from "../infrastructure/api/HttpClient";
import { ApiDeviceRepository } from "../infrastructure/repositories/ApiDeviceRepository";
import { ApiRoomRepository } from "../infrastructure/repositories/ApiRoomRepository";
import {
  GetDeviceListUseCase,
  GetDeviceByIdUseCase,
  UpdateDeviceUseCase,
  ControlDeviceUseCase,
  GetDevicesModifiedAfterUseCase,
} from "../application/usecases/DeviceUseCases";
import {
  GetAllRoomsUseCase,
  AddDeviceToRoomUseCase,
} from "../application/usecases/RoomUseCases";
import { ApiAutomationRepository } from "../infrastructure/repositories/ApiAutomationRepository";
import {
  CreateAutomationUseCase,
  DeleteAutomationUseCase,
  GetAllAutomationsUseCase,
  GetAutomationByIdUseCase,
  UpdateAutomationUseCase,
  ControlAutomationUseCase,
} from "../application/usecases/AutomationUseCases";
import { ApiModeRepository } from "../infrastructure/repositories/ApiModeRepository";
import {
  ControlModeUseCase,
  GetModesUseCase,
} from "../application/usecases/ModeUseCases";

export class DependencyContainer {
  private static instance: DependencyContainer;

  private httpClient: HttpClient;
  private localClient: HttpClient;
  private deviceRepository: ApiDeviceRepository;
  private roomRepository: ApiRoomRepository;
  private automationRepository: ApiAutomationRepository;
  private modeRepository: ApiModeRepository;

  private getDeviceListUseCase: GetDeviceListUseCase;
  private getDeviceByIdUseCase: GetDeviceByIdUseCase;
  private updateDeviceUseCase: UpdateDeviceUseCase;
  private controlDeviceUseCase: ControlDeviceUseCase;
  private getDevicesModifiedAfterUseCase: GetDevicesModifiedAfterUseCase;

  private getAllRoomsUseCase: GetAllRoomsUseCase;
  private addDeviceToRoomUseCase: AddDeviceToRoomUseCase;

  private getAllAutomationsUseCase: GetAllAutomationsUseCase;
  private getAutomationByIdUseCase: GetAutomationByIdUseCase;
  private createAutomationUseCase: CreateAutomationUseCase;
  private deleteAutomationUseCase: DeleteAutomationUseCase;
  private updateAutomationUseCase: UpdateAutomationUseCase;
  private controlAutomationUseCase: ControlAutomationUseCase;
  private controlModeUseCase: ControlModeUseCase;
  private getModesUseCase: GetModesUseCase;

  private constructor() {
    // Configuración de la URL base desde las variables de entorno
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5155";
    const localUrl = process.env.EXPO_PUBLIC_ARDUINO_LOCAL_IP || "";

    // Inicialización de dependencias
    this.httpClient = new HttpClient(apiUrl);
    this.localClient = new HttpClient(localUrl);
    console.log("LOCAL:", localUrl);
    this.deviceRepository = new ApiDeviceRepository(
      this.httpClient,
      this.localClient,
    );
    this.roomRepository = new ApiRoomRepository(this.httpClient);
    this.automationRepository = new ApiAutomationRepository(
      this.httpClient,
      this.localClient,
    );
    this.modeRepository = new ApiModeRepository(
      this.httpClient,
      this.localClient,
    );

    // Inicialización de casos de uso
    this.getDeviceListUseCase = new GetDeviceListUseCase(this.deviceRepository);
    this.getDeviceByIdUseCase = new GetDeviceByIdUseCase(this.deviceRepository);
    this.updateDeviceUseCase = new UpdateDeviceUseCase(this.deviceRepository);
    this.controlDeviceUseCase = new ControlDeviceUseCase(this.deviceRepository);
    this.getDevicesModifiedAfterUseCase = new GetDevicesModifiedAfterUseCase(
      this.deviceRepository,
    );
    this.getAllRoomsUseCase = new GetAllRoomsUseCase(this.roomRepository);
    this.addDeviceToRoomUseCase = new AddDeviceToRoomUseCase(
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
    this.controlAutomationUseCase = new ControlAutomationUseCase(
      this.automationRepository,
    );
    this.controlModeUseCase = new ControlModeUseCase(this.modeRepository);
    this.getModesUseCase = new GetModesUseCase(this.modeRepository);
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  public getGetDeviceListUseCase(): GetDeviceListUseCase {
    return this.getDeviceListUseCase;
  }
  public getGetDeviceByIdUseCase(): GetDeviceByIdUseCase {
    return this.getDeviceByIdUseCase;
  }
  public getUpdateDeviceUseCase(): UpdateDeviceUseCase {
    return this.updateDeviceUseCase;
  }
  public getControlDeviceUseCase(): ControlDeviceUseCase {
    return this.controlDeviceUseCase;
  }
  public getGetDevicesModifiedAfterUseCase(): GetDevicesModifiedAfterUseCase {
    return this.getDevicesModifiedAfterUseCase;
  }

  public getGetAllRoomsUseCase(): GetAllRoomsUseCase {
    return this.getAllRoomsUseCase;
  }
  public getAddDeviceToRoomUseCase(): AddDeviceToRoomUseCase {
    return this.addDeviceToRoomUseCase;
  }

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
  public getControlAutomationUseCase(): ControlAutomationUseCase {
    return this.controlAutomationUseCase;
  }

  public getDependency<T>(token: string): T {
    switch (token) {
      case "getDeviceList":
        return this.getDeviceListUseCase as T;
      case "getDeviceById":
        return this.getDeviceByIdUseCase as T;
      case "updateDevice":
        return this.updateDeviceUseCase as T;
      case "controlDevice":
        return this.controlDeviceUseCase as T;
      case "getDevicesModifiedAfter":
        return this.getDevicesModifiedAfterUseCase as T;
      case "getAllRooms":
        return this.getAllRoomsUseCase as T;
      case "addDeviceToRoom":
        return this.addDeviceToRoomUseCase as T;
      case "getAllAutomations":
        return this.getAllAutomationsUseCase as T;
      case "getAutomationById":
        return this.getAutomationByIdUseCase as T;
      case "createAutomation":
        return this.createAutomationUseCase as T;
      case "deleteAutomation":
        return this.deleteAutomationUseCase as T;
      case "updateAutomation":
        return this.updateAutomationUseCase as T;
      case "controlAutomation":
        return this.controlAutomationUseCase as T;
      case "controlMode":
        return this.controlModeUseCase as T;
      case "getAllModes":
        return this.getModesUseCase as T;
      default:
        throw new Error(`Dependency token not found: ${token}`);
    }
  }
}
