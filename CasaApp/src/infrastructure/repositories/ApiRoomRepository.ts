// Implementación concreta del repositorio de Room
import { IRoomRepository } from "../../core/repositories/IRoomRepository";
import { Room } from "../../core/entities/Room";
import { Result } from "../../shared/Result";
import { HttpClient } from "../api/HttpClient";

export class ApiRoomRepository implements IRoomRepository {
  constructor(private httpClient: HttpClient) {}

  async getAll(): Promise<Result<Room[]>> {
    const result = await this.httpClient.get<any>("room/list");

    if (!result.isSuccess) {
      return result as Result<Room[]>;
    }

    try {
      const rooms = result.data.map((roomData: any) =>
        Room.createFromApiResponse({
          id: roomData.id,
          name: roomData.name,
          deviceIds: roomData.devicesId || [],
        }),
      );
      return Result.success(rooms);
    } catch (error) {
      return Result.fromError(error as Error);
    }
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
