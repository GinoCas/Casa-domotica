// Cliente HTTP base para las llamadas a la API
import { Result } from "../../shared/Result";

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<Result<T>> {
    try {
      let json: Result<any>;
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          json = await response.json();
          errorMessage += `: ${json.errors}`;
        } catch {
          const errorText = await response.text();
          errorMessage += `: ${errorText}`;
        }
        return Result.failure([errorMessage]);
      }

      json = await response.json();
      return Result.success(json.data);
    } catch (error) {
      return Result.fromError(error as Error);
    }
  }
  async get<T>(endpoint: string): Promise<Result<T>> {
    try {
      //console.log("obteniendo datos:", `${this.baseUrl}/${endpoint}`);
      const response = await fetch(`${this.baseUrl}/${endpoint}`);
      //console.log("datos obtenidos en:", `${this.baseUrl}/${endpoint}`);
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
      const url = `${this.baseUrl}/${endpoint}`;
      const start = Date.now();
      console.log("Enviando en:", url);
      const cleanedData = data
        ? JSON.parse(
            JSON.stringify(data, (_, value) =>
              value === undefined ? null : value,
            ),
          )
        : undefined;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: cleanedData ? JSON.stringify(cleanedData) : undefined,
      });

      const elapsed = Date.now() - start;
      const procHeader = response.headers?.get("X-Proc-Time");
      console.log(
        "Recibido de:",
        this.baseUrl,
        " con respuesta:",
        response.ok,
        "latencia:",
        `${elapsed}ms`,
        procHeader ? `proc:${procHeader}ms` : "proc:n/a",
      );
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
