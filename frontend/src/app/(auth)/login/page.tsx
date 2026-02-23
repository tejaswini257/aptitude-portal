"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/interceptors/axios";
import BrandLogo from "@/components/BrandLogo";

type ApiErrorShape = {
  message?: string;
  code?: string;
  response?: {
    data?: {
      message?: string;
    };
  } | null;
};

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
  const [networkErrorTip, setNetworkErrorTip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setNetworkErrorTip(false);
    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const data = res.data;

      if (!data?.accessToken) {
        toast.error("Invalid response from server");
        setIsSubmitting(false);
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

      toast.success("Login successful!");
      const target = getPortalPathForRole(role);
      router.push(target);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const error = err as ApiErrorShape;
      // Removed console.error(err) to prevent Next.js Dev Overlay from catching it
      const isNetworkError =
        error?.message === "Network Error" ||
        error?.code === "ERR_NETWORK" ||
        error?.response == null;
      if (isNetworkError) {
        toast.error("Cannot connect to server.");
        setNetworkErrorTip(true);
        return;
      } else {
        const msg = error?.response?.data?.message || "Invalid credentials.";
        // Clean up "Internal server error" into something friendlier if it occurs
        if (msg.toLowerCase().includes("internal server error")) {
          toast.error("Oops, something went wrong on our end. Please try again.");
        } else {
          toast.error(msg);
        }
      }
    }
  };

  return (
    <div className="auth-page">
      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="auth-card space-y-4"
        suppressHydrationWarning
      >
        <div className="flex justify-center mb-2">
          <BrandLogo />
        </div>
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">Sign in to AptiCore</h1>

        {networkErrorTip && (
          <div className="text-left text-sm text-gray-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="font-semibold text-amber-800 mb-2">Backend Connection Issue</p>
            <ol className="list-decimal list-inside space-y-1 mb-2">
              <li>Open a terminal in the project folder.</li>
              <li>Wait until you see &quot;Backend running on port 3001&quot;.</li>
            </ol>
            <code className="bg-amber-100/50 px-2 py-1 rounded text-amber-900 block mt-2 text-xs border border-amber-200/50">
              cd backend && npm run start:dev
            </code>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Email Address</label>
            <input
              type="email"
              placeholder="you@company.com"
              className="input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              suppressHydrationWarning
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              suppressHydrationWarning
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-6 py-2.5 text-base"
          suppressHydrationWarning
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
