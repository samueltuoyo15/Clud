export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

interface FetchOptions extends RequestInit {
  data?: any
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const url = `${API_URL}${endpoint}`
  const token = localStorage.getItem("accessToken")

  const headers = new Headers(options.headers || {})

  if (options.data && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
    body: options.data ? JSON.stringify(options.data) : undefined,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || "API request failed")
  }

  if (response.status === 204) return null
  return response.json().catch(() => null)
}
