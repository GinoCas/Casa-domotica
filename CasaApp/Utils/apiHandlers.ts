import ApiResponse from "@/types/ApiResponse";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function GetHandler<T>(route: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}/${route}`);
  const json = await response.json();
  return json;
}

export async function PostHandler(route: string, data: any) {
  return await fetch(`${API_URL}/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function PutHandler<T>(
  route: string,
  data: any,
): Promise<ApiResponse<T>> {
  const request = await fetch(`${API_URL}/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const response = await request.json();

  return response;
}
