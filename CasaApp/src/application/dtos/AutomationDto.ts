import { AutomationDevice } from "@/src/core/entities/Automation";

export class AutomationDto {
  constructor(
    public readonly name: string,
    public readonly state: boolean,
    public readonly description: string,
    public readonly initTime: string,
    public readonly endTime: string,
    public readonly devices: AutomationDevice[],
  ) {
    this.devices = devices ?? [];
  }
}
