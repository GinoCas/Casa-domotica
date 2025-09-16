import { Result } from "@/src/shared/Result";
import { Automation } from "../entities/Automation";
import { AutomationDto } from "@/src/application/dtos/AutomationDto";

export interface IAutomationRepository {
  getAll(): Promise<Result<Automation[]>>;
  getById(id: number): Promise<Result<Automation>>;
  create(automationDto: AutomationDto): Promise<Result<Automation>>;
  delete(id: number): Promise<Result<boolean>>;
  update(automation: Automation): Promise<Result<Automation>>;
}
