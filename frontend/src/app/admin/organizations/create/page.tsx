"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<"COLLEGE" | "COMPANY">("COLLEGE");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api("/organizations", {
        method: "POST",
        body: JSON.stringify({ name, type }),
      });
      router.push("/admin/organizations");
    } catch (err: any) {
      setError(err.message || "Failed to create organization");
    }
  };

  return (
    <div className="page">
      <div className="header">
        <h2>Create Organization</h2>
        <p className="subtitle">
          Add a new college or company to the platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label>Organization Name</label>
          <input
            placeholder="e.g. ABC Institute of Technology"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Organization Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="COLLEGE">College</option>
            <option value="COMPANY">Company</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="actions">
          <button type="submit" className="primary">
            Save Organization
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>

      <style jsx>{`
        .page {
          max-width: 720px;
          padding: 32px;
        }

        .header {
          margin-bottom: 28px;
        }

        h2 {
          font-size: 26px;
          font-weight: 600;
          color: #111827;
        }

        .subtitle {
          margin-top: 6px;
          color: #6b7280;
          font-size: 14px;
        }

        .form {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 28px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
        }

        label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        input,
        select {
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          font-size: 14px;
          color: #111827;
          background: #fff;
        }

        input::placeholder {
          color: #9ca3af;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 1px #2563eb;
        }

        .error {
          background: #fee2e2;
          color: #b91c1c;
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .actions {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        .primary {
          background: #2563eb;
          color: #ffffff;
          border: none;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .primary:hover {
          background: #1e40af;
        }

        .secondary {
          background: #f9fafb;
          color: #374151;
          border: 1px solid #e5e7eb;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .secondary:hover {
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
}
