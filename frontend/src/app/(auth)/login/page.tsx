"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";

function getPortalPathForRole(role?: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin/dashboard";
    case "COLLEGE_ADMIN":
      return "/college";
    case "COMPANY_ADMIN":
      return "/company/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return "/";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [networkErrorTip, setNetworkErrorTip] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNetworkErrorTip(false);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const data = res.data;

      if (!data?.accessToken) {
        setError("Invalid response from server");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      document.cookie = `accessToken=${data.accessToken}; path=/`;

      let role: string | undefined;
      try {
        const [, payloadBase64] = data.accessToken.split(".");
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson) as { role?: string };
        role = payload.role;
      } catch {
        // fallback if decode fails
      }

      const target = getPortalPathForRole(role);
      router.push(target);
    } catch (err: any) {
      console.error(err);
      const isNetworkError =
        err?.message === "Network Error" ||
        err?.code === "ERR_NETWORK" ||
        err?.response == null;
      if (isNetworkError) {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        setError(
          "Cannot reach server. Is the backend running at " + apiUrl + "?"
        );
        setNetworkErrorTip(true);
        return;
      } else {
        const msg = err?.response?.data?.message;
        setError(msg || "Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="w-96 p-6 bg-white border rounded-lg shadow space-y-4"
        suppressHydrationWarning
      >
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {networkErrorTip && (
          <div className="text-left text-sm text-gray-600 bg-gray-100 p-3 rounded border border-gray-200">
            <p className="font-medium text-gray-700 mb-1">To fix:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open a terminal in the project folder.</li>
              <li>Run: <code className="bg-white px-1 rounded">cd backend && npm run start:dev</code></li>
              <li>Wait until you see &quot;Backend running on port 3001&quot;.</li>
              <li>Try logging in again.</li>
            </ol>
            <p className="mt-2 text-xs text-gray-500">
              If the app is deployed, set <code className="bg-white px-1">NEXT_PUBLIC_API_URL</code> to your backend URL (e.g. Render).
            </p>
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          suppressHydrationWarning
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          suppressHydrationWarning
        />

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          suppressHydrationWarning
        >
          Login
        </button>
      </form>
    </div>
  );
}
