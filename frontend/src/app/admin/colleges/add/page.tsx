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
        if (list.length > 0 && !form.orgId)
          setForm((f) => ({ ...f, orgId: list[0].id }));
      })
      .catch(() => setError("Failed to load organizations"));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/colleges"
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to Colleges
      </Link>

      {/* Title */}
      <h2 className="text-2xl font-semibold">Add College</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="card max-w-md space-y-3"
      >
        <label className="text-sm font-medium">Organization *</label>
        <select
          name="orgId"
          value={form.orgId}
          onChange={handleChange}
          required
          className="input"
        >
          <option value="">Select organization</option>
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name} ({o.type})
            </option>
          ))}
        </select>

        <label className="text-sm font-medium">College Name *</label>
        <input
          name="collegeName"
          value={form.collegeName}
          onChange={handleChange}
          required
          placeholder="College Name"
          className="input"
        />

        <label className="text-sm font-medium">College Type *</label>
        <select
          name="collegeType"
          value={form.collegeType}
          onChange={handleChange}
          className="input"
        >
          {COLLEGE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <label className="text-sm font-medium">Address</label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="input"
        />

        <label className="text-sm font-medium">Contact Person *</label>
        <input
          name="contactPerson"
          value={form.contactPerson}
          onChange={handleChange}
          required
          placeholder="Contact Person"
          className="input"
        />

        <label className="text-sm font-medium">Contact Email *</label>
        <input
          name="contactEmail"
          type="email"
          value={form.contactEmail}
          onChange={handleChange}
          required
          placeholder="contact@college.edu"
          className="input"
        />

        <label className="text-sm font-medium">Mobile *</label>
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          required
          placeholder="Mobile"
          className="input"
        />

        <label className="text-sm font-medium">Max Students *</label>
        <input
          name="maxStudents"
          type="number"
          min={1}
          value={form.maxStudents}
          onChange={handleChange}
          required
          className="input"
        />

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Saving..." : "Add College"}
          </button>

          <Link
            href="/admin/colleges"
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}