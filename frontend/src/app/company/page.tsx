"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";
import { toast } from "react-hot-toast";

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

  const handleCreate = async () => {
    try {
      await api.post("/companies", form);
      setForm({ name: "", adminEmail: "", adminPassword: "" });
      fetchCompanies();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create company");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this company?")) return;

    try {
      await api.delete(`/companies/${id}`);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast.error("Failed to delete company");
    }
  };

  if (loading) return <p className="text-gray-500">Loading companies...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="page-title mb-6">Companies</h2>

      {/* CREATE CARD */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-4">Add Company</h3>

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

        <button className="btn-primary" onClick={handleCreate}>
          Create Company
        </button>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-head">Name</th>
              <th className="table-head">Type</th>
              <th className="table-head">Created</th>
              <th className="table-head">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {companies.map((c) => (
              <tr key={c.id} className="table-row">
                <td className="table-cell">{c.name}</td>
                <td className="table-cell">{c.type}</td>
                <td className="table-cell">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="table-cell">
                  <button
                    className="btn-danger"
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
    </div>
  );
}