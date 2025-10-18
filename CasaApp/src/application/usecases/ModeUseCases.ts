import { Result } from "@/src/shared/Result";
import { IModeRepository } from "@/src/core/repositories/IModeRepository";
import { ArduinoModeDto } from "../dtos/ArduinoModeDto";
import { Mode } from "@/src/core/entities/Mode";

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

export class GetModesUseCase {
  constructor(private modeRepository: IModeRepository) {}

  async execute(): Promise<Result<Mode[]>> {
    try {
      return await this.modeRepository.getAll();
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}