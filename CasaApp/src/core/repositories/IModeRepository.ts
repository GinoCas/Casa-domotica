import { Result } from "@/src/shared/Result";
import { ArduinoModeDto } from "@/src/application/dtos/ArduinoModeDto";
import { Mode } from "@/src/core/entities/Mode";

export interface IModeRepository {
  control(dto: ArduinoModeDto): Promise<Result<boolean>>;
  getAll(): Promise<Result<Mode[]>>;
}