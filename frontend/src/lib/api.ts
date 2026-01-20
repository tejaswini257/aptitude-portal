const API_BASE = "http://localhost:3001"

export async function api(
  url: string,
  options: RequestInit = {}
) {
  if (typeof window === "undefined") {
    throw new Error("API can only be called from client components")
  }

  const token = localStorage.getItem("accessToken")

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    let message = "Request failed"
    try {
      const data = await res.json()
      message = data.message || message
    } catch (_) {}
    throw new Error(message)
  }

  return res.json()
}
