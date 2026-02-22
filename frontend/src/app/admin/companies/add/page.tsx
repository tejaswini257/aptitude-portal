"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

export default function AddCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    adminEmail: "",
    adminPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.adminEmail || !form.adminPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (form.adminPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/companies", {
        name: form.name,
        adminEmail: form.adminEmail,
        adminPassword: form.adminPassword,
      });

      router.push("/admin/companies");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/companies"
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to Companies
      </Link>

      {/* Title */}
      <h2 className="text-2xl font-semibold">Add Company</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="card max-w-md space-y-3"
      >
        <label className="text-sm font-medium">Company Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Company Name"
          className="input"
        />

        <label className="text-sm font-medium">Admin Email *</label>
        <input
          name="adminEmail"
          type="email"
          value={form.adminEmail}
          onChange={handleChange}
          required
          placeholder="admin@company.com"
          className="input"
        />

        <label className="text-sm font-medium">
          Admin Password * (min 6 characters)
        </label>
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

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Saving..." : "Add Company"}
          </button>

          <Link
            href="/admin/companies"
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}