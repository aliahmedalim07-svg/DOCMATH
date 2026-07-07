const configuredApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_BASE_URL = (configuredApiUrl || "/api").replace(/\/+$/, "");

const STATUS_TEXTS: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

function errorStatusText(status: number, statusText: string): string {
  return statusText || STATUS_TEXTS[status] || `HTTP ${status}`;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("dr-ziad-math-ig-token");
  
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const normalizedEndpoint = endpoint.trim().replace(/^\/?/, "/");
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${errorStatusText(response.status, response.statusText)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

/** For requests that return no body (204 No Content) */
export async function apiFetchNoContent(endpoint: string, options: RequestInit = {}): Promise<void> {
  const token = localStorage.getItem("dr-ziad-math-ig-token");

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const normalizedEndpoint = endpoint.trim().replace(/^\/?/, "/");
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${errorStatusText(response.status, response.statusText)}`);
  }
}

/** For multipart/form-data uploads — no Content-Type header (browser sets boundary) */
export async function apiUpload<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = localStorage.getItem("dr-ziad-math-ig-token");

  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const normalizedEndpoint = endpoint.trim().replace(/^\/?/, "/");
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${errorStatusText(response.status, response.statusText)}`);
  }

  // Some upload endpoints return 204
  if (response.status === 204) return undefined as T;
  return response.json();
}
