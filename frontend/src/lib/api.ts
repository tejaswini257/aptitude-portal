const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default async function api(
  url: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const isAuthRoute =
    url.includes("/auth/login") || url.includes("/auth/register");

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(!isAuthRoute && token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 && !isAuthRoute) {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "API error");
  }

  return res.json();
}
