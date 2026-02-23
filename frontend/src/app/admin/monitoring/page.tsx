"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type MonitoringSummary = {
  users: number;
  organizations: number;
  tests: number;
  submissions: number;
};

type ProctoringEvent = {
  id: string;
  userId: string;
  orgId: string;
  orgType: string;
  cameraActive: boolean;
  audioActive: boolean;
  tabSwitched: boolean;
  warningCount: number;
  maxWarningsAllowed: number;
  timestamp: string;
};

type MonitoringPayload = {
  summary: MonitoringSummary;
  proctoringEvents: ProctoringEvent[];
  checkedAt: string;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function AdminMonitoringPage() {
  const [data, setData] = useState<MonitoringPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMonitoring = async () => {
    try {
      const res = await api.get("/admin/monitoring");
      setData(res.data as MonitoringPayload);
      setError("");
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to load monitoring data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoring();
  }, []);

  if (loading) return <p className="text-secondary">Loading monitoring dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p className="text-secondary">No monitoring data found.</p>;

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Monitoring & Security</h2>
          <p className="page-subtitle">Track platform load and recent proctoring violations.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => void fetchMonitoring()}>
          Refresh
        </button>
      </div>

      <div className="dashboard-grid-2">
        <div className="dashboard-card tone-info">
          <p className="dashboard-card-title">Total Users</p>
          <h3 className="dashboard-card-value">{data.summary.users}</h3>
        </div>
        <div className="dashboard-card tone-info">
          <p className="dashboard-card-title">Organizations</p>
          <h3 className="dashboard-card-value">{data.summary.organizations}</h3>
        </div>
        <div className="dashboard-card tone-success">
          <p className="dashboard-card-title">Tests</p>
          <h3 className="dashboard-card-value">{data.summary.tests}</h3>
        </div>
        <div className="dashboard-card tone-accent">
          <p className="dashboard-card-title">Submissions</p>
          <h3 className="dashboard-card-value">{data.summary.submissions}</h3>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="font-semibold">Recent Proctoring Events</h3>
          <span className="text-xs text-secondary">Last sync: {new Date(data.checkedAt).toLocaleString()}</span>
        </div>

        {data.proctoringEvents.length === 0 ? (
          <p className="empty-state">No proctoring events available yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-head">Time</th>
                <th className="table-head">User</th>
                <th className="table-head">Org</th>
                <th className="table-head">Camera</th>
                <th className="table-head">Tab Switch</th>
                <th className="table-head">Warnings</th>
              </tr>
            </thead>
            <tbody>
              {data.proctoringEvents.map((event) => (
                <tr key={event.id} className="table-row">
                  <td className="table-cell">{new Date(event.timestamp).toLocaleString()}</td>
                  <td className="table-cell">{event.userId}</td>
                  <td className="table-cell">
                    {event.orgType} ({event.orgId})
                  </td>
                  <td className="table-cell">
                    <span className={event.cameraActive ? "badge-success" : "badge-warning"}>
                      {event.cameraActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={event.tabSwitched ? "badge-warning" : "badge-success"}>
                      {event.tabSwitched ? "Detected" : "No"}
                    </span>
                  </td>
                  <td className="table-cell">
                    {event.warningCount}/{event.maxWarningsAllowed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
