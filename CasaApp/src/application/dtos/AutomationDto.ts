import { AutomationDevice } from "@/src/core/entities/Automation";

export class AutomationDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
  ) {}
}
