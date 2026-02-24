"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/interceptors/axios";
import { Search, Building2, Clock, Activity, CheckCircle2, ShieldCheck } from "lucide-react";

type Test = {
  id: string;
  name: string;
  createdAt: string;
  showResultImmediately: boolean;
  proctoringEnabled: boolean;
  organization?: {
    name: string;
    type: string;
  };
  rules?: {
    marksPerQuestion: number;
    negativeMarking: boolean;
    negativeMarks: number;
  };
  sections?: Array<{
    timeLimit: number;
    section: { sectionName: string };
  }>;
  _count?: {
    submissions: number;
  };
};

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api
      .get("/admin/tests")
      .then((res) => setTests(Array.isArray(res.data) ? res.data : []))
      .catch((err) =>
        setError(
          err?.response?.data?.message ||
          (err?.response?.status === 403
            ? "Access denied. Superadmin privileges required."
            : "Failed to load tests framework.")
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredTests = useMemo(() => {
    if (!searchQuery) return tests;
    const lowerQuery = searchQuery.toLowerCase();
    return tests.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        (t.organization?.name || "").toLowerCase().includes(lowerQuery)
    );
  }, [tests, searchQuery]);

  if (loading) return (
    <div className="flex animate-pulse flex-col space-y-4">
      <div className="h-20 bg-gray-100 rounded-xl"></div>
      <div className="h-64 bg-gray-100 rounded-xl"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
      <p className="font-semibold">Error Loading Master Test Directory</p>
      <p className="text-sm mt-1">{error}</p>
    </div>
  );

  return (
    <div className="page space-y-6 pb-8">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title text-3xl">Platform Tests Library</h2>
          <p className="page-subtitle mt-1">
            Global monitoring of all operational tests created across colleges and companies.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card p-0 overflow-hidden shadow-sm border-gray-100">
        <div className="p-4 bg-surface-muted border-b flex sm:flex-row flex-col gap-4 justify-between items-center text-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search tests or organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface border border-default rounded-lg text-primary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-4 text-secondary font-medium px-2">
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
              <Activity size={16} /> Total: {tests.length}
            </div>
          </div>
        </div>

        {/* Directory List */}
        <div className="overflow-x-auto">
          {filteredTests.length === 0 ? (
            <div className="p-12 text-center text-secondary border-t">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mb-3">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="font-medium text-gray-900">No tests found</p>
              <p className="text-sm mt-1">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 border-b">
                  <th className="px-6 py-4 font-semibold w-[35%]">Test Information</th>
                  <th className="px-6 py-4 font-semibold">Origin Organization</th>
                  <th className="px-6 py-4 font-semibold">Rules / Setup</th>
                  <th className="px-6 py-4 font-semibold text-center">Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTests.map((t) => {
                  const duration = t.sections?.[0]?.timeLimit ?? 0;
                  const orgName = t.organization?.name || "System Admin";
                  const orgType = t.organization?.type || "SYSTEM";

                  return (
                    <tr key={t.id} className="hover:bg-gray-50/30 transition-colors group">

                      {/* Column 1: Test Metadata */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {t.name}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md text-gray-700 font-medium">
                            <Clock size={12} /> {duration > 0 ? `${duration} min` : "Flexible"}
                          </span>
                          <span className="flex items-center gap-1">
                            Added {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Column 2: Organization Origin */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className={orgType === 'COMPANY' ? 'text-indigo-400' : 'text-emerald-400'} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{orgName}</div>
                            <div className="text-xs text-gray-500">{orgType}</div>
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Evaluation Rules */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs leading-none border border-green-200">
                              +{t.rules?.marksPerQuestion ?? 1} Marks
                            </span>
                            {t.rules?.negativeMarking && (
                              <span className="font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs leading-none border border-red-200">
                                -{t.rules?.negativeMarks ?? 0} Penality
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {t.proctoringEnabled ? (
                              <span title="AI Proctoring Enabled" className="flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                <ShieldCheck size={12} /> AI Guard ON
                              </span>
                            ) : null}
                            {t.showResultImmediately ? (
                              <span title="Instant Evaluation" className="flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                                <CheckCircle2 size={12} /> Instant Results
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      {/* Column 4: Submissions */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 border border-gray-100 min-w-20">
                          <span className="text-lg font-bold text-gray-900 leading-none">
                            {t._count?.submissions ?? 0}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mt-1">Attempts</span>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}