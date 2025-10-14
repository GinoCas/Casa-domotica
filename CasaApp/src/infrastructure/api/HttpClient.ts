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
      const json = await response.json();
      return Result.success(json.data);
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
      console.log("Enviando en:", `${this.baseUrl}/${endpoint}`);
      const cleanedData = data
        ? JSON.parse(
            JSON.stringify(data, (_, value) =>
              value === undefined ? null : value,
            ),
          )
        : undefined;
      console.log(cleanedData);

      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: cleanedData ? JSON.stringify(cleanedData) : undefined,
      });

      console.log("Recibido de:", this.baseUrl, " con respuesta:", response.ok);
      return await this.handleResponse<T>(response);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
  async patch<T>(endpoint: string, data?: any): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: "PATCH",
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

  async delete<T>(endpoint: string): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: "DELETE",
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
}
