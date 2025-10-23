import { IAutomationRepository } from "@/src/core/repositories/IAutomationRepository";
import { HttpClient } from "../api/HttpClient";
import { Result } from "@/src/shared/Result";
import { Automation } from "@/src/core/entities/Automation";
import { AutomationDto } from "@/src/application/dtos/AutomationDto";
import { ArduinoAutomationDto } from "@/src/application/dtos/ArduinoAutomationDto";

export class ApiAutomationRepository implements IAutomationRepository {
  constructor(
    private httpClient: HttpClient,
    private localClient: HttpClient,
  ) {}

  async getAll(): Promise<Result<Automation[]>> {
    const result = await this.httpClient.get<any[]>("automation/list");
    if (!result.isSuccess) {
      return result as Result<Automation[]>;
    }

    try {
      const automations = result.data.map((automation: any) =>
        Automation.fromApiResponse(automation),
      );
      return Result.success(automations);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }

  async getById(id: number): Promise<Result<Automation>> {
    const result = await this.httpClient.get<any>(`automation/${id}`);
    if (!result.isSuccess) {
      return result as Result<Automation>;
    }

    try {
      const automation = Automation.fromApiResponse(result.data);
      return Result.success(automation);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }

  async delete(id: number): Promise<Result<boolean>> {
    let result = await this.localClient.delete<boolean>(`automation/${id}`);
    if (!result.isSuccess) {
      result = await this.httpClient.delete<any>(
        `automation/control/erase/${id}`,
      );
    }

    if (!result.isSuccess) {
      return Result.failure(result.errors);
    }

    return Result.success(true);
  }

  async update(
    automationId: number,
    dto: AutomationDto,
  ): Promise<Result<Automation>> {
    const result = await this.httpClient.patch<Automation>(
      `automation/update/${automationId}`,
      dto,
    );
    if (!result.isSuccess) {
      return Result.failure(result.errors);
    }
    try {
      const updatedAutomation = Automation.fromApiResponse(result.data);
      return Result.success(updatedAutomation);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }

  async control(dto: ArduinoAutomationDto): Promise<Result<boolean>> {
    let result = await this.localClient.put<boolean>(`automation`, dto);
    if (!result.isSuccess) {
      result = await this.httpClient.put<boolean>(`automation/control`, dto);
    }
    if (!result.isSuccess) {
      return Result.failure(result.errors);
    }
    return Result.success(true);
  }

  async getModifiedAfter(dateUtc: string): Promise<Result<Automation[]>> {
    const encoded = encodeURIComponent(dateUtc);
    const result = await this.httpClient.get<any[]>(
      `automation/date?dateUtc=${encoded}`,
    );
    if (!result.isSuccess) {
      return result as Result<Automation[]>;
    }
    try {
      const automations = result.data.map((automation: any) =>
        Automation.fromApiResponse(automation),
      );
      return Result.success(automations);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}
