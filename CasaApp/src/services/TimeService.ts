import { HttpClient } from "../infrastructure/api/HttpClient";
import { Result } from "../shared/Result";
import { ArduinoTimeDto } from "../application/dtos/ArduinoTimeDto";

const localUrl = process.env.EXPO_PUBLIC_ARDUINO_LOCAL_IP || "";

export class TimeService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient(localUrl);
  }

  async sync(dto: ArduinoTimeDto): Promise<Result<boolean>> {
    if (!localUrl || !localUrl.startsWith("http")) {
      return Result.failure<boolean>([
        "EXPO_PUBLIC_ARDUINO_LOCAL_IP inválido o no definido",
      ]);
    }
    return this.client.put<boolean>("time", dto);
  }
}