"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/interceptors/axios";

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function AddCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    adminEmail: "",
    adminPassword: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const payload = {
      name: form.name.trim(),
      adminEmail: form.adminEmail.trim(),
      adminPassword: form.adminPassword,
    };

    if (!payload.name || !payload.adminEmail || !payload.adminPassword) {
      setError("Please fill all required fields.");
      return;
    }

    if (payload.adminPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/companies", payload);
      router.push("/admin/companies");
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to create company.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Add Company</h2>
          <p className="page-subtitle">Create a new recruiter organization and its primary admin login.</p>
        </div>
        <Link href="/admin/companies" className="btn btn-secondary">
          Back to Companies
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="card max-w-xl space-y-4">
        <div>
          <label className="field-label">Company Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Example: Vertex Technologies"
            className="input"
          />
        </div>

        <div>
          <label className="field-label">Admin Email *</label>
          <input
            name="adminEmail"
            type="email"
            value={form.adminEmail}
            onChange={handleChange}
            required
            placeholder="admin@company.com"
            className="input"
          />
        </div>

        <div>
          <label className="field-label">Admin Password * (min 6 characters)</label>
          <input
            name="adminPassword"
            type="password"
            value={form.adminPassword}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Password"
            className="input"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Creating..." : "Create Company"}
          </button>
          <Link href="/admin/companies" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
