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
    default:
      return "/";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const data = res.data;

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
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="w-96 p-6 bg-white border rounded-lg shadow space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
