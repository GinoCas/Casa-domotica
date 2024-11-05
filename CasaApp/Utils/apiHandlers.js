const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function GetHandler(route) {
  const response = await fetch(`${API_URL}/${route}`);
  return await response.json();
}

export async function PostHandler(route, data) {
  return await fetch(API_URL + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
