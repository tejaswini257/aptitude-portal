"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/interceptors/axios";

export default function QuestionBankPage() {
  const [search, setSearch] = useState("");
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await api.get("/sections?isQuestionBank=true");
      setSections(res.data);
    } catch (err) {
      console.error("Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  const filteredSections = sections.filter((section) =>
    section.sectionName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Question Bank</h1>
          <p className="text-gray-500 text-sm">
            Manage reusable sections and their questions
          </p>
        </div>

        <Link
          href="/college/question-bank/create"
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          + Create Section
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search sections..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
      />

      {filteredSections.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No sections found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {section.sectionName}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {section._count?.questions ?? 0} Questions
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/college/question-bank/${section.id}`}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
                >
                  Manage Questions
                </Link>
                <button
                  onClick={async () => {
                    if (
                      !confirm(
                        "Delete this section? All questions inside it will be removed."
                      )
                    )
                      return;
                    try {
                      await api.delete(`/sections/${section.id}`);
                      fetchSections();
                    } catch (err: any) {
                      alert(err?.response?.data?.message || "Failed to delete");
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}