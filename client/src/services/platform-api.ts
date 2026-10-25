import { TOKEN_KEY } from "./api";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

type RequestOptions = {
  method?: string;
  body?: unknown;
  authenticated?: boolean;
};

export const platformRequest = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (options.authenticated) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: "Réponse serveur invalide."
  }));

  if (!response.ok) {
    throw new Error(data.message || "Une erreur est survenue.");
  }

  return data as T;
};
