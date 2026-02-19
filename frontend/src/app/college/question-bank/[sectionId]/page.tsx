"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/interceptors/axios";

interface Section {
  id: string;
  sectionName: string;
  description?: string;
  type: "MCQ" | "CODING";
  questions: any[];
}

export default function SectionDetailPage() {
  const params = useParams();
  const sectionId = params.sectionId as string;

  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    try {
      const res = await api.get(`/sections/${sectionId}`);
      setSection(res.data);
    } catch (err: any) {
      setError("Failed to load section");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!section) {
    return <div className="p-6">Section not found</div>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* Section Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          {section.sectionName}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Type: {section.type}
        </p>

        {section.description && (
          <p className="text-gray-600 mt-2">
            {section.description}
          </p>
        )}
      </div>

      {/* Question Summary */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">
              Total Questions: {section.questions.length}
            </p>
          </div>

          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">
            + Add Question
          </button>
        </div>
      </div>

      {/* Question Builder Area */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        {section.type === "MCQ" ? (
          <p>MCQ Question Builder UI will render here.</p>
        ) : (
          <p>Coding Question Builder UI will render here.</p>
        )}
      </div>

    </div>
  );
}
