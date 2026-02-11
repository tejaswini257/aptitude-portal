"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type Org = { id: string; name: string; type: string };

const COLLEGE_TYPES = ["ENGINEERING", "DEGREE", "POLYTECHNIC", "OTHER"];

export default function AddCollegePage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Org[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    orgId: "",
    collegeName: "",
    collegeType: "ENGINEERING",
    address: "",
    contactPerson: "",
    contactEmail: "",
    mobile: "",
    maxStudents: 100,
  });

  useEffect(() => {
    api
      .get("/organizations")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setOrganizations(list);
        if (list.length > 0 && !form.orgId) setForm((f) => ({ ...f, orgId: list[0].id }));
      })
      .catch(() => setError("Failed to load organizations"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "maxStudents" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.orgId || !form.collegeName || !form.contactEmail || !form.mobile) {
      setError("Please fill required fields.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/colleges", {
        orgId: form.orgId,
        collegeName: form.collegeName,
        collegeType: form.collegeType,
        address: form.address,
        contactPerson: form.contactPerson,
        contactEmail: form.contactEmail,
        mobile: form.mobile,
        maxStudents: form.maxStudents,
      });
      router.push("/admin/colleges");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create college");
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
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link
          href="/admin/colleges"
          style={{ color: "#64748b", textDecoration: "none", fontSize: "14px" }}
        >
          ← Back to Colleges
        </Link>
      </div>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "24px" }}>
        Add College
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
          Organization *
        </label>
        <select
          name="orgId"
          value={form.orgId}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select organization</option>
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name} ({o.type})
            </option>
          ))}
        </select>

        <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
          College Name *
        </label>
        <input
          name="collegeName"
          value={form.collegeName}
          onChange={handleChange}
          required
          placeholder="College Name"
          style={inputStyle}
        />

        <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
          College Type *
        </label>
        <select
          name="collegeType"
          value={form.collegeType}
          onChange={handleChange}
          style={inputStyle}
        >
          {COLLEGE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
          Address
        </label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          style={inputStyle}
        />

        <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
          Contact Person *
        </label>
        <input
          name="contactPerson"
          value={form.contactPerson}
          onChange={handleChange}
          required
          placeholder="Contact Person"
          style={inputStyle}
        />

        <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
          Contact Email *
        </label>
        <input
          name="contactEmail"
          type="email"
          value={form.contactEmail}
          onChange={handleChange}
          required
          placeholder="contact@college.edu"
          style={inputStyle}
        />

        <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
          Mobile *
        </label>
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          required
          placeholder="Mobile"
          style={inputStyle}
        />

        <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
          Max Students *
        </label>
        <input
          name="maxStudents"
          type="number"
          min={1}
          value={form.maxStudents}
          onChange={handleChange}
          required
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
            {loading ? "Saving..." : "Add College"}
          </button>
          <Link
            href="/admin/colleges"
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
