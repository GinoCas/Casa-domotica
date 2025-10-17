import { Automation } from "../core/entities/Automation";
import { Result } from "../shared/Result";
import { DependencyContainer } from "../shared/DependencyContainer";
import { ArduinoAutomationDto } from "../application/dtos/ArduinoAutomationDto";

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
    // Tomamos snapshot inicial
    const getAll = this.container.getGetAllAutomationsUseCase();
    const baseline = await getAll.execute();
    if (!baseline.isSuccess) return Result.failure(baseline.errors);

    // Construimos un payload por defecto para Arduino
    const dto = new ArduinoAutomationDto(
      8, // StartHour
      0, // StartMinute
      20, // EndHour
      0, // EndMinute
      127, // Days (todos los días)
      false, // State inicial apagado
      [], // Devices vacíos
      -1,
    );

    const controlUseCase = this.container.getControlAutomationUseCase();
    const controlResult = await controlUseCase.execute(dto);
    if (!controlResult.isSuccess) {
      return Result.failure(controlResult.errors);
    }

    // Polling corto hasta que el backend reciba y persista la automatización publicada por Arduino
    const baselineIds = new Set((baseline.data ?? []).map((a) => a.id));
    for (let i = 0; i < 20; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const current = await getAll.execute();
      if (!current.isSuccess) continue;
      const created = (current.data ?? []).find((a) => !baselineIds.has(a.id));
      if (created) {
        return Result.success(created);
      }
    }

    return Result.failure([
      "No se pudo confirmar la creación. Inténtalo de nuevo o verifica la conexión con Arduino.",
    ]);
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
