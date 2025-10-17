import { Result } from "../shared/Result";
import { DependencyContainer } from "../shared/DependencyContainer";
import { ArduinoModeDto } from "@/src/application/dtos/ArduinoModeDto";
import { ControlModeUseCase } from "@/src/application/usecases/ModeUseCases";

export class ModeService {
  private container = DependencyContainer.getInstance();

  async controlMode(dto: ArduinoModeDto): Promise<Result<boolean>> {
    const useCase = this.container.getDependency<ControlModeUseCase>(
      "controlMode",
    );
    return await useCase.execute(dto);
  }
}

export const modeService = new ModeService();