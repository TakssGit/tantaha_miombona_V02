const API_URL =
  import.meta.env.VITE_API_URL || "/api";

const TOKEN_KEY =
  "tantsaha_token";

const request =
  async <T>(
    path: string,
    options:
      RequestInit = {}
  ): Promise<T> => {
    const token =
      localStorage.getItem(
        TOKEN_KEY
      );

    const headers =
      new Headers(
        options.headers
      );

    if (
      options.body &&
      !headers.has(
        "Content-Type"
      )
    ) {
      headers.set(
        "Content-Type",
        "application/json"
      );
    }

    if (token) {
      headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }

    const response =
      await fetch(
        `${API_URL}${path}`,
        {
          ...options,
          headers
        }
      );

    if (
      response.status === 401
    ) {
      localStorage.removeItem(
        TOKEN_KEY
      );

      localStorage.removeItem(
        "tantsaha_user"
      );
    }

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Erreur API."
      );
    }

    return data as T;
  };

export const api = {
  get: <T>(
    path: string
  ) =>
    request<T>(path),

  post: <T>(
    path: string,
    body: unknown
  ) =>
    request<T>(
      path,
      {
        method: "POST",
        body:
          JSON.stringify(body)
      }
    ),

  put: <T>(
    path: string,
    body: unknown
  ) =>
    request<T>(
      path,
      {
        method: "PUT",
        body:
          JSON.stringify(body)
      }
    ),

  patch: <T>(
    path: string,
    body:
      unknown = {}
  ) =>
    request<T>(
      path,
      {
        method: "PATCH",
        body:
          JSON.stringify(body)
      }
    )
};

export {
  API_URL,
  TOKEN_KEY
};
