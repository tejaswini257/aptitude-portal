"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";


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

    // Axios returns data directly
    const data = res.data;

    console.log("LOGIN RESPONSE:", data);

    // Store token using the same key the rest of the app expects
    localStorage.setItem("accessToken", data.accessToken);
    document.cookie = `accessToken=${data.accessToken}; path=/`;

    console.log("Token saved:", data.accessToken);

    // redirect after login
    window.location.href = "/college/departments";
  } catch (err: any) {
    console.error(err);
    setError("Login failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-96 p-6 border rounded-lg space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="input w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-primary w-full">
          Login
        </button>
      </form>
    </div>
  );
}
