type CommandType = "setState" | "setBrightness" | "setSpeed" | "toggleState";

export interface CommandDto {
  deviceId: number;
  commandName: string;
  parameters: Record<string, any>;
}

export function createCommand(deviceId: number, commandName: CommandType, parameters: Record<string, any>): CommandDto {
  return {
    deviceId,
    commandName,
    parameters
  };
}

export function createStateCommand(deviceId: number, state: boolean): CommandDto {
  return createCommand(deviceId, "setState", { state });
}

export function createBrightnessCommand(deviceId: number, brightness: number): CommandDto {
  return createCommand(deviceId, "setBrightness", { brightness });
}

export function createSpeedCommand(deviceId: number, speed: number): CommandDto {
  return createCommand(deviceId, "setSpeed", { speed });
}

export function createToggleCommand(deviceId: number): CommandDto {
  return createCommand(deviceId, "toggleState", {});
}