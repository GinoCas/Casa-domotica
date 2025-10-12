export class ArduinoDeviceDto {
  constructor(
    public readonly id: number,
    public readonly state: boolean,
    public readonly type?: string,
    public readonly brightness?: number,
    public readonly speed?: number,
  ) {}
}
