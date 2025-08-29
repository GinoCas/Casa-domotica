// Cliente HTTP base para las llamadas a la API
import { Result } from "../../shared/Result";

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<Result<T>> {
    try {
      if (!response.ok) {
        const errorText = await response.text();
        return Result.failure([`HTTP ${response.status}: ${errorText}`]);
      }

      const data = await response.json();
      return data as Result<T>;
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }

  async get<T>(endpoint: string): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`);
      return await this.handleResponse<T>(response);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}
