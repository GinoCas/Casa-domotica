import { IAutomationRepository } from "@/src/core/repositories/IAutomationRepository";
import { HttpClient } from "../api/HttpClient";
import { Result } from "@/src/shared/Result";
import { Automation } from "@/src/core/entities/Automation";

export class ApiAutomationRepository implements IAutomationRepository {
  constructor(private httpClient: HttpClient) {}
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
  async create(): Promise<Result<Automation>> {
    const result = await this.httpClient.post<any>("automation/create", {});
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
    const result = await this.httpClient.delete<any>(`automation/erase/${id}`);
    if (!result.isSuccess) {
      return result as Result<boolean>;
    }

    return Result.success(true);
  }
  async update(automation: Automation): Promise<Result<Automation>> {
    const result = await this.httpClient.patch<any>(
      `automation/edit/${automation.id}`,
      automation,
    );
    if (!result.isSuccess) {
      return result as Result<Automation>;
    }

    try {
      const updatedAutomation = Automation.fromApiResponse(result.data);
      return Result.success(updatedAutomation);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}
