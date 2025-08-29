import { Device } from "@/types/Device";
import { Result } from "@/types/Response";
import { GetHandler, PostHandler } from "@/Utils/apiHandlers";
import {
  CommandDto,
  createBrightnessCommand,
  createSpeedCommand,
  createStateCommand,
} from "@/Utils/CommandDtoFactory";

export async function getDeviceList(): Promise<Result<Device[]>> {
  return await GetHandler<Device[]>("device/list");
}

export async function getDeviceById(id: number): Promise<Result<Device>> {
  return await GetHandler<Device>("device/" + id);
}

async function executeDeviceCommand(
  cmdDto: CommandDto,
): Promise<Result<CommandDto>> {
  return await PostHandler<CommandDto>("device/execute", cmdDto);
}

export async function setDeviceState(
  deviceId: number,
  state: boolean,
): Promise<Result<CommandDto>> {
  return executeDeviceCommand(createStateCommand(deviceId, state));
}

export async function setBrightness(
  deviceId: number,
  brightness: number,
): Promise<Result<CommandDto>> {
  return executeDeviceCommand(createBrightnessCommand(deviceId, brightness));
}

export async function setSpeed(
  deviceId: number,
  speed: number,
): Promise<Result<any>> {
  return executeDeviceCommand(createSpeedCommand(deviceId, speed));
}
