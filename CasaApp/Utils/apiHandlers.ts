const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function GetHandler(route: string) {
  const response = await fetch(`${API_URL}/${route}`);
  const json = await response.json();
  const { data, cdRes, dsRes, errors, alerts } = json;
  return { data, cdRes, dsRes, errors, alerts };
}

export async function PostHandler(route: string, data: any) {
  return await fetch(`${API_URL}/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
