const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default async function api(method, path, body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = "Bearer " + token;
  try {
    const res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    return res.json();
  } catch {
    return { success: false, message: "Erro de conexão com o servidor." };
  }
}
