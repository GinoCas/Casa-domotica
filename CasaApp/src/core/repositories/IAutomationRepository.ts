import { Result } from "@/src/shared/Result";
import { Automation } from "../entities/Automation";
import { AutomationDto } from "@/src/application/dtos/AutomationDto";
import { ArduinoAutomationDto } from "@/src/application/dtos/ArduinoAutomationDto";

export interface IAutomationRepository {
  getAll(): Promise<Result<Automation[]>>;
  getById(id: number): Promise<Result<Automation>>;
  delete(id: number): Promise<Result<boolean>>;
  update(automationId: number, dto: AutomationDto): Promise<Result<Automation>>;
  control(automation: ArduinoAutomationDto): Promise<Result<boolean>>;
}
