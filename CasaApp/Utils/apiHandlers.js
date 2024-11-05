const API_URL = "https://localhost:7031/";

export async function GetHandler(route, apiUrl = API_URL) {
  const response = await fetch("https://localhost:7031/living");
  return await response.json();
}

export async function PostHandler(route, data, apiUrl = API_URL) {
  return await fetch(API_URL + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
