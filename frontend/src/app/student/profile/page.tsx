"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/interceptors/axios";

type StudentProfile = {
  studentId: string;
  email: string;
  rollNo: string;
  year: number;
  college?: { id: string; collegeName: string };
  department?: { id: string; name: string };
  fullName: string;
  phone: string;
  education: {
    tenthPercentage?: number | null;
    twelfthPercentage?: number | null;
    cgpa?: number | null;
    branch?: string | null;
    graduationYear?: number | null;
  };
  skills: string[];
  updatedAt: string | null;
};

type HistoryItem = {
  submissionId: string;
  testId: string;
  testName: string;
  score: number;
  submittedAt: string;
  status: string;
  showResultImmediately: boolean;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    tenthPercentage: "",
    twelfthPercentage: "",
    cgpa: "",
    branch: "",
    graduationYear: "",
    skills: "",
  });

  const fetchData = async () => {
    try {
      const [profileRes, historyRes] = await Promise.all([
        api.get("/students/me/profile"),
        api.get("/students/me/history"),
      ]);

      const p = profileRes.data as StudentProfile;
      const h = Array.isArray(historyRes.data) ? (historyRes.data as HistoryItem[]) : [];
      setProfile(p);
      setHistory(h);
      setForm({
        fullName: p.fullName ?? "",
        phone: p.phone ?? "",
        tenthPercentage: p.education?.tenthPercentage?.toString() ?? "",
        twelfthPercentage: p.education?.twelfthPercentage?.toString() ?? "",
        cgpa: p.education?.cgpa?.toString() ?? "",
        branch: p.education?.branch ?? "",
        graduationYear: p.education?.graduationYear?.toString() ?? "",
        skills: (p.skills || []).join(", "),
      });
      setError("");
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const parsedSkills = useMemo(
    () =>
      form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    [form.skills],
  );

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      await api.put("/students/me/profile", {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        education: {
          tenthPercentage: form.tenthPercentage ? Number(form.tenthPercentage) : null,
          twelfthPercentage: form.twelfthPercentage ? Number(form.twelfthPercentage) : null,
          cgpa: form.cgpa ? Number(form.cgpa) : null,
          branch: form.branch.trim() || null,
          graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
        },
        skills: parsedSkills,
      });
      await fetchData();
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      window.alert(e?.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-secondary">Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!profile) return <p className="text-secondary">Profile unavailable.</p>;

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">My Profile</h2>
          <p className="page-subtitle">Update your personal and academic details used in placement workflows.</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-3">Account Snapshot</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-secondary">Email</p>
            <p className="font-semibold">{profile.email}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">Roll No</p>
            <p className="font-semibold">{profile.rollNo}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">Year</p>
            <p className="font-semibold">{profile.year}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">Department</p>
            <p className="font-semibold">{profile.department?.name || "N/A"}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="card space-y-4">
        <h3 className="font-semibold text-lg">Personal & Education Details</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="field-label">Full Name</label>
            <input
              className="input"
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="field-label">Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Mobile number"
            />
          </div>

          <div>
            <label className="field-label">10th Percentage</label>
            <input
              className="input"
              type="number"
              min={0}
              max={100}
              value={form.tenthPercentage}
              onChange={(e) => setForm((prev) => ({ ...prev, tenthPercentage: e.target.value }))}
            />
          </div>

          <div>
            <label className="field-label">12th Percentage</label>
            <input
              className="input"
              type="number"
              min={0}
              max={100}
              value={form.twelfthPercentage}
              onChange={(e) => setForm((prev) => ({ ...prev, twelfthPercentage: e.target.value }))}
            />
          </div>

          <div>
            <label className="field-label">CGPA</label>
            <input
              className="input"
              type="number"
              min={0}
              max={10}
              step="0.01"
              value={form.cgpa}
              onChange={(e) => setForm((prev) => ({ ...prev, cgpa: e.target.value }))}
            />
          </div>

          <div>
            <label className="field-label">Graduation Year</label>
            <input
              className="input"
              type="number"
              min={2000}
              max={2100}
              value={form.graduationYear}
              onChange={(e) => setForm((prev) => ({ ...prev, graduationYear: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="field-label">Branch</label>
            <input
              className="input"
              value={form.branch}
              onChange={(e) => setForm((prev) => ({ ...prev, branch: e.target.value }))}
              placeholder="Computer Science, Mechanical, etc."
            />
          </div>

          <div className="md:col-span-2">
            <label className="field-label">Skills (comma separated)</label>
            <input
              className="input"
              value={form.skills}
              onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))}
              placeholder="Aptitude, DSA, React, SQL"
            />
          </div>
        </div>

        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="font-semibold">Test History & Status</h3>
        </div>
        {history.length === 0 ? (
          <p className="empty-state">No attempts yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-head">Test</th>
                <th className="table-head">Score</th>
                <th className="table-head">Status</th>
                <th className="table-head">Attempted On</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.submissionId} className="table-row">
                  <td className="table-cell">{item.testName}</td>
                  <td className="table-cell">{item.score}</td>
                  <td className="table-cell">
                    <span className="badge-success">{item.status}</span>
                  </td>
                  <td className="table-cell">{new Date(item.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
