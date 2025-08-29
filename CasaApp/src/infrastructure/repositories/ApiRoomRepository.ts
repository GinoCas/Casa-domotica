// Implementación concreta del repositorio de Room
import { IRoomRepository } from "../../core/repositories/IRoomRepository";
import { Room } from "../../core/entities/Room";
import { Result } from "../../shared/Result";
import { HttpClient } from "../api/HttpClient";

export class ApiRoomRepository implements IRoomRepository {
  constructor(private httpClient: HttpClient) {}

  async getNames(): Promise<Result<string[]>> {
    return await this.httpClient.get<string[]>("room/names");
  }

  async getByName(name: string): Promise<Result<Room>> {
    const result = await this.httpClient.get<any>(`room/${name}`);

    if (!result.isSuccess) {
      return result as Result<Room>;
    }

    try {
      const room = Room.createFromApiResponse(result.data);
      return Result.success(room);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }

  async getDevicesByRoomName(roomName: string): Promise<Result<number[]>> {
    const result = await this.httpClient.get<any[]>(`room/${roomName}/devices`);

    if (!result.isSuccess) {
      return result as Result<number[]>;
    }

    try {
      const devices = result.data;

      return Result.success(devices);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}
