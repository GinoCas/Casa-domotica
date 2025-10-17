export interface AutomationDeviceDto {
  Id: number;
  State: boolean;
}

export class ArduinoAutomationDto {
  constructor(
    public readonly StartHour: number,
    public readonly StartMinute: number,
    public readonly EndHour: number,
    public readonly EndMinute: number,
    public readonly Days: number,
    public readonly State: boolean,
    public readonly Devices: AutomationDeviceDto[],
    public readonly Id: number,
  ) {
    this.Devices = Devices ?? [];
  }
}
