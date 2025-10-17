import { Automation } from "@/src/core/entities/Automation";
import { IAutomationRepository } from "@/src/core/repositories/IAutomationRepository";
import { Result } from "@/src/shared/Result";
import { AutomationDto } from "../dtos/AutomationDto";
import { ArduinoAutomationDto } from "../dtos/ArduinoAutomationDto";

export class GetAllAutomationsUseCase {
  constructor(private automationRepository: IAutomationRepository) {}

  async execute(): Promise<Result<Automation[]>> {
    try {
      return await this.automationRepository.getAll();
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}

export class GetAutomationByIdUseCase {
  constructor(private automationRepository: IAutomationRepository) {}

  async execute(id: number): Promise<Result<Automation>> {
    try {
      return await this.automationRepository.getById(id);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}

export class CreateAutomationUseCase {
  constructor(private automationRepository: IAutomationRepository) {}

  async execute(): Promise<Result<Automation>> {
    try {
      const newAutomation = new AutomationDto(
        "New Automation",
        false,
        "Description",
        "08:00",
        "20:00",
        [],
      );
      return await this.automationRepository.create(newAutomation);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}

export class DeleteAutomationUseCase {
  constructor(private automationRepository: IAutomationRepository) {}

  async execute(id: number): Promise<Result<boolean>> {
    try {
      return await this.automationRepository.delete(id);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}

export class UpdateAutomationUseCase {
  constructor(private automationRepository: IAutomationRepository) {}

  async execute(automation: Automation): Promise<Result<Automation>> {
    try {
      return await this.automationRepository.update(automation);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}

export class ControlAutomationUseCase {
  constructor(private automationRepository: IAutomationRepository) {}

  async execute(dto: ArduinoAutomationDto): Promise<Result<boolean>> {
    try {
      return await this.automationRepository.control(dto);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}
