// Servicio de Room usando Clean Architecture
import { Room } from "../core/entities/Room";
import { Result } from "../shared/Result";
import { DependencyContainer } from "../shared/DependencyContainer";

export class RoomService {
  private container = DependencyContainer.getInstance();

  async getAllRooms(): Promise<Result<Room[]>> {
    const useCase = this.container.getGetAllRoomsUseCase();
    return await useCase.execute();
  }

  async getRoomNames(): Promise<Result<string[]>> {
    const useCase = this.container.getGetRoomNamesUseCase();
    return await useCase.execute();
  }

  async getRoomByName(name: string): Promise<Result<Room>> {
    const useCase = this.container.getGetRoomByNameUseCase();
    return await useCase.execute(name);
  }

  async getDevicesByRoomName(roomName: string): Promise<Result<number[]>> {
    const useCase = this.container.getGetDevicesByRoomNameUseCase();
    return await useCase.execute(roomName);
  }
}

export const roomService = new RoomService();
