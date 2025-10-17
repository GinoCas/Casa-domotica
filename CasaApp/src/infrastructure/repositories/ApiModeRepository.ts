import { IModeRepository } from "@/src/core/repositories/IModeRepository";
import { HttpClient } from "../api/HttpClient";
import { Result } from "@/src/shared/Result";
import { ArduinoModeDto } from "@/src/application/dtos/ArduinoModeDto";

export class ApiModeRepository implements IModeRepository {
  constructor(
    private httpClient: HttpClient,
    private localClient: HttpClient,
  ) {}

  async control(dto: ArduinoModeDto): Promise<Result<boolean>> {
    // Primero intentamos enviar al Arduino local
    let result = await this.localClient.put<boolean>(`mode`, dto);
    if (!result.isSuccess) {
      // Si falla (Arduino no accesible), enviamos al backend para que publique por MQTT
      result = await this.httpClient.put<boolean>(`mode/control`, dto);
    }

    if (!result.isSuccess) {
      return Result.failure(result.errors);
    }

    return Result.success(true);
  }
}