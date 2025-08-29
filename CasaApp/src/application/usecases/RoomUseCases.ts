// Casos de uso para Room
import { Room } from "../../core/entities/Room";
import { IRoomRepository } from "../../core/repositories/IRoomRepository";
import { Result } from "../../shared/Result";

export class GetRoomNamesUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(): Promise<Result<string[]>> {
    try {
      return await this.roomRepository.getNames();
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}

export class GetRoomByNameUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(name: string): Promise<Result<Room>> {
    try {
      if (!name || name.trim().length === 0) {
        return Result.failure(["Room name cannot be empty"]);
      }
      return await this.roomRepository.getByName(name.trim());
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}

export class GetDevicesByRoomNameUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(roomName: string): Promise<Result<number[]>> {
    try {
      if (!roomName || roomName.trim().length === 0) {
        return Result.failure(["Room name cannot be empty"]);
      }
      return await this.roomRepository.getDevicesByRoomName(roomName.trim());
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}
