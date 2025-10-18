import { Result } from "../shared/Result";
import { DependencyContainer } from "../shared/DependencyContainer";
import { ArduinoModeDto } from "@/src/application/dtos/ArduinoModeDto";
import { ControlModeUseCase, GetModesUseCase } from "@/src/application/usecases/ModeUseCases";
import { Mode } from "@/src/core/entities/Mode";

export class ModeService {
  private container = DependencyContainer.getInstance();

  async controlMode(dto: ArduinoModeDto): Promise<Result<boolean>> {
    const useCase = this.container.getDependency<ControlModeUseCase>(
      "controlMode",
    );
    return await useCase.execute(dto);
  }

  async getModes(): Promise<Result<Mode[]>> {
    const useCase = this.container.getDependency<GetModesUseCase>(
      "getAllModes",
    );
    return await useCase.execute();
  }
}

export const modeService = new ModeService();