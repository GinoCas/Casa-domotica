import { Result } from "../../shared/Result";

export class HttpClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(
    baseUrl: string,
    options?: { timeoutMs?: number },
  ) {
    this.baseUrl = baseUrl;
    const envTimeout = parseInt(process.env.EXPO_PUBLIC_HTTP_TIMEOUT_MS ?? "");
    this.timeoutMs =
      options?.timeoutMs ?? (Number.isFinite(envTimeout) ? envTimeout : 10000);
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url || "";
  }

  private async fetchWithTimeout(
    url: string,
    init?: RequestInit,
    timeout?: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeout ?? this.timeoutMs);
    try {
      return await fetch(url, { ...(init ?? {}), signal: controller.signal });
    } finally {
      clearTimeout(t);
    }
  }

  private async handleResponse<T>(response: Response, ctx: string): Promise<Result<T>> {
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

  private handleError<T>(error: unknown, ctx: string): Result<T> {
    const err = error as Error;
    const isAbort = err?.name === "AbortError";
    if (isAbort) {
      return Result.failure(["Timeout de la solicitud."]);
    }
    return Result.fromError(err);
  }

  async get<T>(endpoint: string): Promise<Result<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    try {
      const response = await this.fetchWithTimeout(url);
      return await this.handleResponse<T>(response, `GET ${url}`);
    } catch (error) {
      return this.handleError<T>(error, `GET ${url}`);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<Result<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    try {
      const response = await this.fetchWithTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data ? JSON.stringify(data) : undefined,
      });
      return await this.handleResponse<T>(response, `POST ${url}`);
    } catch (error) {
      return this.handleError<T>(error, `POST ${url}`);
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<Result<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    try {
      const start = Date.now();
      const cleanedData = data
        ? JSON.parse(
            JSON.stringify(data, (_, v) => (v === undefined ? null : v)),
          )
        : undefined;
      const response = await this.fetchWithTimeout(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: cleanedData ? JSON.stringify(cleanedData) : undefined,
      });
      const elapsed = Date.now() - start;
      const procHeader = response.headers?.get("X-Proc-Time");
      console.log(
        "Recibido:",
        response.ok,
        "lat:",
        `${elapsed}ms`,
        procHeader ? `proc:${procHeader}ms` : "proc:n/a",
      );
      return await this.handleResponse<T>(response, `PUT ${url}`);
    } catch (error) {
      return this.handleError<T>(error, `PUT ${url}`);
    }
  }

  async patch<T>(endpoint: string, data?: any): Promise<Result<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    try {
      const response = await this.fetchWithTimeout(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: data ? JSON.stringify(data) : undefined,
      });
      return await this.handleResponse<T>(response, `PATCH ${url}`);
    } catch (error) {
      return this.handleError<T>(error, `PATCH ${url}`);
    }
  }

  async delete<T>(endpoint: string): Promise<Result<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    try {
      const response = await this.fetchWithTimeout(url, { method: "DELETE" });
      return await this.handleResponse<T>(response, `DELETE ${url}`);
    } catch (error) {
      return this.handleError<T>(error, `DELETE ${url}`);
    }
  }
}
