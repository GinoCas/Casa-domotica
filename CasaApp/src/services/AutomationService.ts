import { Automation } from "../core/entities/Automation";
import { Result } from "../shared/Result";
import { DependencyContainer } from "../shared/DependencyContainer";
import { ArduinoAutomationDto } from "../application/dtos/ArduinoAutomationDto";
import { parseTimeString } from "@/Utils/parseTimeString";
import { AutomationDto } from "../application/dtos/AutomationDto";

export class AutomationService {
  private container = DependencyContainer.getInstance();

  async getAllAutomations(): Promise<Result<Automation[]>> {
    const useCase = this.container.getGetAllAutomationsUseCase();
    return await useCase.execute();
  }

  async getAutomationById(id: number): Promise<Result<Automation>> {
    const useCase = this.container.getGetAutomationByIdUseCase();
    return await useCase.execute(id);
  }

  async deleteAutomation(id: number): Promise<Result<boolean>> {
    const useCase = this.container.getDeleteAutomationUseCase();
    return await useCase.execute(id);
  }

  async controlAutomation(automation: Automation): Promise<Result<Automation>> {
    const initDate = parseTimeString(automation.initTime);
    const endDate = parseTimeString(automation.endTime);
    const dto = new ArduinoAutomationDto(
      initDate.getUTCHours(),
      initDate.getUTCMinutes(),
      endDate.getUTCHours(),
      endDate.getUTCMinutes(),
      automation.days,
      automation.state,
      automation.devices.map((d) => ({ Id: d.id, State: d.autoState })),
      automation.id,
    );
    const controlUseCase = this.container.getControlAutomationUseCase();
    const controlResult = await controlUseCase.execute(dto);
    return controlResult.isSuccess
      ? Result.success(automation)
      : Result.failure(["No se pudo enviar la automatización."]);
  }

  async updateAutomation(
    id: number,
    dto: AutomationDto,
  ): Promise<Result<Automation>> {
    const useCase = this.container.getUpdateAutomationUseCase();
    return await useCase.execute(id, dto);
  }
}

export const automationService = new AutomationService();
