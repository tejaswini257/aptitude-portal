"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type Subscription = {
  orgId: string;
  orgName: string;
  orgType: "COLLEGE" | "COMPANY";
  createdAt: string;
  validityDays: number;
  expiryDate: string;
  status: "ACTIVE" | "EXPIRED";
  updatedAt: string | null;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function AdminSubscriptionsPage() {
  const [items, setItems] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draftDays, setDraftDays] = useState<Record<string, number>>({});

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get("/admin/subscriptions");
      const list = Array.isArray(res.data) ? (res.data as Subscription[]) : [];
      setItems(list);
      const draft: Record<string, number> = {};
      list.forEach((item) => {
        draft[item.orgId] = item.validityDays;
      });
      setDraftDays(draft);
      setError("");
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const updateValidity = async (orgId: string) => {
    const validityDays = Number(draftDays[orgId] ?? 0);
    if (!Number.isFinite(validityDays) || validityDays < 1) {
      window.alert("Validity days must be greater than 0.");
      return;
    }

    setSavingId(orgId);
    try {
      await api.put(`/admin/subscriptions/${orgId}`, { validityDays });
      await fetchSubscriptions();
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      window.alert(e?.response?.data?.message || "Failed to update validity.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <p className="text-secondary">Loading subscriptions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Subscriptions & Validity</h2>
          <p className="page-subtitle">Control active period for colleges and companies.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="font-semibold">Organization Validity</h3>
        </div>

        {items.length === 0 ? (
          <p className="empty-state">No organizations found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-head">Organization</th>
                <th className="table-head">Type</th>
                <th className="table-head">Current Validity</th>
                <th className="table-head">Expiry</th>
                <th className="table-head">Status</th>
                <th className="table-head">Update</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.orgId} className="table-row">
                  <td className="table-cell">
                    <p className="font-semibold">{item.orgName}</p>
                    <p className="text-xs text-secondary">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="table-cell">{item.orgType}</td>
                  <td className="table-cell">{item.validityDays} days</td>
                  <td className="table-cell">{new Date(item.expiryDate).toLocaleDateString()}</td>
                  <td className="table-cell">
                    <span className={item.status === "ACTIVE" ? "badge-success" : "badge-warning"}>
                      {item.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <input
                        className="input w-24"
                        type="number"
                        min={1}
                        value={draftDays[item.orgId] ?? item.validityDays}
                        onChange={(event) =>
                          setDraftDays((prev) => ({
                            ...prev,
                            [item.orgId]: Number(event.target.value),
                          }))
                        }
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => void updateValidity(item.orgId)}
                        disabled={savingId === item.orgId}
                      >
                        {savingId === item.orgId ? "Saving..." : "Save"}
                      </button>
                    </div>
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
