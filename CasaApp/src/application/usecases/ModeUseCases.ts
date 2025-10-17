import { Result } from "@/src/shared/Result";
import { IModeRepository } from "@/src/core/repositories/IModeRepository";
import { ArduinoModeDto } from "../dtos/ArduinoModeDto";

export class ControlModeUseCase {
  constructor(private modeRepository: IModeRepository) {}

  async execute(dto: ArduinoModeDto): Promise<Result<boolean>> {
    try {
      if (!dto.Name || dto.Name.trim().length === 0) {
        return Result.failure(["Mode Name must be provided"]);
      }
      return await this.modeRepository.control(dto);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}