import { Response } from "./responseFormat";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function GetHandler(route) {
  const response = await fetch(`${API_URL}/${route}`);
  const json = await response.json();
  const { data, cdRes, dsRes, errors, alerts } = json;
  return new Response(data, cdRes, dsRes, errors, alerts);
}

export async function PostHandler(route, data) {
  return await fetch(`${API_URL}/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
