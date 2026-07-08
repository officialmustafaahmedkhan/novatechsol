const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

interface FetchOptions extends RequestInit {
  token?: string
}

async function fetchApi<T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOpts } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOpts.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOpts,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new ApiError(data.message || "Request failed", res.status, data.errors)
  }

  return data
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    fetchApi<T>(endpoint, { method: "GET", token }),

  post: <T>(endpoint: string, body?: unknown, token?: string) =>
    fetchApi<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined, token }),

  put: <T>(endpoint: string, body?: unknown, token?: string) =>
    fetchApi<T>(endpoint, { method: "PUT", body: body ? JSON.stringify(body) : undefined, token }),

  delete: <T>(endpoint: string, token?: string) =>
    fetchApi<T>(endpoint, { method: "DELETE", token }),

  upload: <T>(endpoint: string, formData: FormData, token?: string) => {
    const headers: Record<string, string> = {}
    if (token) headers["Authorization"] = `Bearer ${token}`
    return fetchApi<T>(endpoint, {
      method: "POST",
      body: formData,
      headers,
    })
  },
}
