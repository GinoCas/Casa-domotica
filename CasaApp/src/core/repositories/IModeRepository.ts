import { Result } from "@/src/shared/Result";
import { ArduinoModeDto } from "@/src/application/dtos/ArduinoModeDto";

export interface IModeRepository {
  control(dto: ArduinoModeDto): Promise<Result<boolean>>;
}