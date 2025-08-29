// DTOs para comandos de dispositivos
export interface CommandDto {
  deviceId: number;
  commandName: string;
  parameters?: Record<string, any>;
}

export interface DeviceStateCommandDto extends CommandDto {
  commandName: "setState";
  parameters: {
    state: boolean;
  };
}

export interface DeviceBrightnessCommandDto extends CommandDto {
  commandName: "setBrightness";
  parameters: {
    brightness: number;
  };
}

export interface DeviceSpeedCommandDto extends CommandDto {
  commandName: "setSpeed";
  parameters: {
    speed: number;
  };
}

// Factory para crear comandos
export class CommandDtoFactory {
  static createStateCommand(
    deviceId: number,
    state: boolean,
  ): DeviceStateCommandDto {
    return {
      deviceId,
      commandName: "setState",
      parameters: { state },
    };
  }

  static createBrightnessCommand(
    deviceId: number,
    brightness: number,
  ): DeviceBrightnessCommandDto {
    return {
      deviceId,
      commandName: "setBrightness",
      parameters: { brightness },
    };
  }

  static createSpeedCommand(
    deviceId: number,
    speed: number,
  ): DeviceSpeedCommandDto {
    return {
      deviceId,
      commandName: "setSpeed",
      parameters: { speed },
    };
  }
}
