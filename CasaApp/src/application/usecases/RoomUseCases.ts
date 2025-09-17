// Casos de uso para Room
import { Room } from "../../core/entities/Room";
import { IRoomRepository } from "../../core/repositories/IRoomRepository";
import { Result } from "../../shared/Result";

export class GetAllRoomsUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(): Promise<Result<Room[]>> {
    try {
      return await this.roomRepository.getAll();
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}
