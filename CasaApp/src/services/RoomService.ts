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

  async addDeviceToRoom(
    roomId: number,
    deviceId: number,
  ): Promise<Result<boolean>> {
    const useCase = this.container.getAddDeviceToRoomUseCase();
    return await useCase.execute(roomId, deviceId);
  }
}

export const roomService = new RoomService();
