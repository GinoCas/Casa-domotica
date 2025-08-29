// Interfaz de repositorio para Room - Definida en el dominio
import { Room } from "../entities/Room";
import { Result } from "../../shared/Result";

export interface IRoomRepository {
  getNames(): Promise<Result<string[]>>;
  getByName(name: string): Promise<Result<Room>>;
  getDevicesByRoomName(roomName: string): Promise<Result<number[]>>;
}
