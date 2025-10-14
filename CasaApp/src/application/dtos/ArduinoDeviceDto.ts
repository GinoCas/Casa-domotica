export class ArduinoDeviceDto {
  constructor(
    public readonly Id: number,
    public readonly State: boolean,
    public readonly Type?: string,
    public readonly Brightness?: number,
    public readonly Speed?: number,
  ) {}
}
