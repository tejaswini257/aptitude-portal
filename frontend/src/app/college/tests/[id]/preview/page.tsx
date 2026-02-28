"use client";

import { useEffect, useState, use } from "react";
import api from "@/interceptors/axios";
import { useRouter } from "next/navigation";

export default function PracticeSetPreviewPage(props: any) {
  const params = use(props.params) as { id: string };
  const id = params.id;
  const router = useRouter();

  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPreview();
  }, [id]);

  const fetchPreview = async () => {
    try {
      const res = await api.get(`/tests/${id}/preview`);
      setTest(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load preview");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Preview...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!test) return <div className="p-8 text-center">No preview available</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{test.test.name} (Preview)</h1>
          <p className="text-gray-500 mt-1">
            {test.test.durationMode === "GLOBAL" 
              ? `Global Duration: ${test.test.totalDuration} mins` 
              : "Section-wise Duration"}
          </p>
        </div>
        <button
          onClick={() => router.push(`/college/tests/${id}/builder`)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back to Builder
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {test.sections.map((section: any, sIndex: number) => (
          <div key={section.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Section {sIndex + 1}: {section.sectionName}
              </h2>
              {test.test.durationMode === "SECTION" && (
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {section.timeLimit} mins
                </span>
              )}
            </div>

            <div className="p-6 space-y-6">
              {section.questions.length === 0 ? (
                <p className="text-gray-500 italic">No questions in this section.</p>
              ) : (
                section.questions.map((q: any, qIndex: number) => (
                  <div key={q.id} className="border rounded-lg p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                        <span className="font-bold text-gray-700">Q{qIndex + 1}.</span>
                        <div>
                          <p className="font-medium text-gray-900 whitespace-pre-wrap">
                            {q.questionText || "(Unseen passage / text)"}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Type: {q.type.replace("_", " ")} | 
                            Marks: {q.marks} 
                            {test.rules.negativeMarking && ` | Negative: -${q.negativeMarks}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pl-8 space-y-2 mt-4">
                      {q.options?.map((opt: any, oIndex: number) => (
                        <div key={oIndex} className="flex items-center gap-3 p-2 rounded-lg border bg-gray-50">
                          <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center bg-white text-xs">
                            {String.fromCharCode(65 + oIndex)}
                          </div>
                          <span className="text-sm">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
