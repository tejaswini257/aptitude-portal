"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type Company = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    adminEmail: "",
    adminPassword: "",
  });

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/companies");
      setCompanies(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (err?.response?.status === 403
            ? "Only super admin can view companies."
            : "Failed to load companies")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        adminEmail: form.adminEmail,
        adminPassword: form.adminPassword,
      };

      await api.post("/companies", payload);
      alert("Company created successfully. Admin can log in with the email and password you set.");
      setForm({ name: "", adminEmail: "", adminPassword: "" });
      fetchCompanies();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          (err?.response?.status === 403
            ? "Only super admin can create companies."
            : "Failed to create company")
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this company? This will remove the organization and its admin user(s).")) return;

    try {
      await api.delete(`/companies/${id}`);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          (err?.response?.status === 403
            ? "Only super admin can delete companies."
            : "Failed to delete company")
      );
    }
  };

  if (loading) return <p className="p-6">Loading companies...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="container">

      {/* ✅ PAGE TITLE */}
      <h1 className="page-title">Companies</h1>

      {/* ✅ COMPANY CARD — CREATE FORM GOES HERE */}
      <div className="card">
        <h2>Add Company</h2>

        <input
          className="input"
          placeholder="Company Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="input"
          placeholder="Admin Email"
          type="email"
          value={form.adminEmail}
          onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
        />

        <input
          className="input"
          placeholder="Admin Password"
          type="password"
          value={form.adminPassword}
          onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
        />

        <button className="primary-btn" onClick={handleCreate}>
          Create Company
        </button>
      </div>
      {/* ⬆️ COMPANY CARD ENDS HERE */}

      {/* ✅ TABLE COMES AFTER THE CARD */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.type}</td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="danger-btn"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

