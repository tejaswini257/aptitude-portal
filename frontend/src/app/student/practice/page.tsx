"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpenCheck } from "lucide-react";
import api from "@/interceptors/axios";

type PracticeSection = {
  id: string;
  name: string;
  questionCount: number;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function PracticePage() {
  const [sections, setSections] = useState<PracticeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/questions/practice/sections")
      .then((res) => {
        setSections(Array.isArray(res.data) ? (res.data as PracticeSection[]) : []);
      })
      .catch((err: ApiErrorShape) => {
        setError(err?.response?.data?.message || "Failed to load practice sections.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-secondary">Loading practice sections...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Practice Hub</h2>
          <p className="page-subtitle">Topic-wise aptitude and reasoning practice with difficulty filters.</p>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="card empty-state">
          <p>No practice sections available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`/student/practice/${encodeURIComponent(section.name)}`}
              className="card card-link p-5 space-y-3 hover:shadow-md transition"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold">
                <BookOpenCheck size={14} />
                Topic
              </div>
              <h3 className="text-xl font-semibold">{section.name}</h3>
              <p className="text-secondary text-sm">{section.questionCount} practice questions available</p>
              <span className="text-blue-600 font-semibold text-sm">Start Practice</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
