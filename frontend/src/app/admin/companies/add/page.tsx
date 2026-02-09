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

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    marginBottom: "12px",
  };

  return (
    <>
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/admin/companies"
          style={{ color: "#64748b", textDecoration: "none", fontSize: "14px" }}
        >
          ← Back to Companies
        </Link>
      </div>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "24px" }}>
        Add Company
      </h2>
      {error && (
        <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "480px",
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
          Company Name *
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Company Name"
          style={inputStyle}
        />

        <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
          Admin Email *
        </label>
        <input
          name="adminEmail"
          type="email"
          value={form.adminEmail}
          onChange={handleChange}
          required
          placeholder="admin@company.com"
          style={inputStyle}
        />

        <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
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
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Saving..." : "Add Company"}
          </button>
          <Link
            href="/admin/companies"
            style={{
              padding: "10px 20px",
              background: "#e2e8f0",
              color: "#334155",
              borderRadius: "8px",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
