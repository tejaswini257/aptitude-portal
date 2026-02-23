"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/interceptors/axios";

type Drive = {
  id: string;
  testId: string;
  startDate: string;
  endDate: string;
  isOpenDrive: boolean;
  description?: string | null;
  applicants?: number;
  test?: {
    id: string;
    name: string;
  };
};

type CompanyTest = {
  id: string;
  name: string;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function DrivesPage() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [tests, setTests] = useState<CompanyTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    testId: "",
    startDate: "",
    endDate: "",
    description: "",
    isOpenDrive: true,
  });

  const fetchData = async () => {
    try {
      const [drivesRes, testsRes] = await Promise.all([
        api.get("/company/drives"),
        api.get("/company/tests"),
      ]);

      const fetchedDrives = Array.isArray(drivesRes.data) ? drivesRes.data : [];
      const fetchedTests = Array.isArray(testsRes.data) ? testsRes.data : [];

      setDrives(fetchedDrives);
      setTests(fetchedTests);
      setForm((prev) => ({
        ...prev,
        testId: prev.testId || fetchedTests[0]?.id || "",
      }));
      setError("");
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to load drives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = useMemo(() => {
    if (!form.testId || !form.startDate || !form.endDate) return false;
    return new Date(form.startDate).getTime() < new Date(form.endDate).getTime();
  }, [form]);

  const handleCreateDrive = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!validate) {
      setFormError("Choose a test and ensure end date is after start date.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/company/drives", {
        testId: form.testId,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        description: form.description.trim() || undefined,
        isOpenDrive: form.isOpenDrive,
      });

      setForm((prev) => ({
        ...prev,
        startDate: "",
        endDate: "",
        description: "",
      }));
      await fetchData();
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setFormError(e?.response?.data?.message || "Unable to create drive.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Recruitment Drives</h2>
          <p className="page-subtitle">Create drive windows and map them to your assessment tests.</p>
        </div>
      </div>

      <form onSubmit={handleCreateDrive} className="card grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <h3 className="font-semibold text-lg">Create New Drive</h3>
        </div>

        <div>
          <label className="field-label">Select Test</label>
          <select
            className="input"
            value={form.testId}
            onChange={(e) => setForm((prev) => ({ ...prev, testId: e.target.value }))}
          >
            {tests.length === 0 ? (
              <option value="">No tests available. Create a test first.</option>
            ) : (
              tests.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.name}
                </option>
              ))
            )}
          </select>
        </div>

        <label className="check-field top-space">
          <input
            type="checkbox"
            checked={form.isOpenDrive}
            onChange={(e) => setForm((prev) => ({ ...prev, isOpenDrive: e.target.checked }))}
          />
          <span>Open drive (allow broad participation)</span>
        </label>

        <div>
          <label className="field-label">Start Date & Time</label>
          <input
            className="input"
            type="datetime-local"
            value={form.startDate}
            onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
          />
        </div>

        <div>
          <label className="field-label">End Date & Time</label>
          <input
            className="input"
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
          />
        </div>

        <div className="md:col-span-2">
          <label className="field-label">Description</label>
          <textarea
            className="input"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Role expectations, process details, and eligibility notes..."
          />
        </div>

        {formError && <p className="text-sm text-red-500 md:col-span-2">{formError}</p>}

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary" disabled={saving || tests.length === 0}>
            {saving ? "Creating..." : "Create Drive"}
          </button>
        </div>
      </form>

      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="font-semibold">Drive Pipeline</h3>
        </div>

        {loading ? (
          <p className="empty-state">Loading drives...</p>
        ) : error ? (
          <p className="empty-state text-red-500">{error}</p>
        ) : drives.length === 0 ? (
          <p className="empty-state">No drives created yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-head">Drive</th>
                <th className="table-head">Test</th>
                <th className="table-head">Window</th>
                <th className="table-head">Applicants</th>
                <th className="table-head">Status</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((drive) => {
                const isClosed = new Date(drive.endDate).getTime() < Date.now();
                return (
                  <tr key={drive.id} className="table-row">
                    <td className="table-cell">
                      <p className="font-medium">{drive.description || "Untitled drive"}</p>
                      <p className="text-xs text-secondary mt-1">
                        {drive.isOpenDrive ? "Open Drive" : "Restricted Drive"}
                      </p>
                    </td>
                    <td className="table-cell">{drive.test?.name || drive.testId}</td>
                    <td className="table-cell">
                      {new Date(drive.startDate).toLocaleString()} - {new Date(drive.endDate).toLocaleString()}
                    </td>
                    <td className="table-cell">{drive.applicants ?? 0}</td>
                    <td className="table-cell">
                      <span className={isClosed ? "badge-warning" : "badge-success"}>
                        {isClosed ? "Closed" : "Active"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
