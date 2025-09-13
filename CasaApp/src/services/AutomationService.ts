import { Automation } from "../core/entities/Automation";
import { Result } from "../shared/Result";
import { DependencyContainer } from "../shared/DependencyContainer";

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

  async createAutomation(): Promise<Result<Automation>> {
    const useCase = this.container.getCreateAutomationUseCase();
    return await useCase.execute();
  }

  async deleteAutomation(id: number): Promise<Result<boolean>> {
    const useCase = this.container.getDeleteAutomationUseCase();
    return await useCase.execute(id);
  }

  async updateAutomation(automation: Automation): Promise<Result<Automation>> {
    const useCase = this.container.getUpdateAutomationUseCase();
    return await useCase.execute(automation);
  }
}

export const automationService = new AutomationService();
