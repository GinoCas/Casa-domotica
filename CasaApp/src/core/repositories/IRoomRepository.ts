// Interfaz de repositorio para Room - Definida en el dominio
import { Room } from "../entities/Room";
import { Result } from "../../shared/Result";

export interface IRoomRepository {
  getAll(): Promise<Result<Room[]>>;
  addDeviceToRoom(roomId: number, deviceId: number): Promise<Result<boolean>>;
}
