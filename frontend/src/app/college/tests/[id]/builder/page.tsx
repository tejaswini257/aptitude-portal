"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";
import { useParams, useRouter } from "next/navigation";
import AddQuestionModal from "./AddQuestionModal";

export default function TestBuilderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [questionBank, setQuestionBank] = useState<any[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [test, setTest] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchBuilder();
  }, []);

  const fetchBuilder = async () => {
    try {
      const res = await api.get(`/tests/${id}/builder`);
      setTest(res.data);
      if (res.data.sections?.length > 0) {
        setSelectedSection(res.data.sections[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchQuestions = async () => {
  try {
    const res = await api.get("/questions/bank", {
      params: {
        sectionId: selectedSection,
      },
    });
    setQuestionBank(res.data);
  } catch (err) {
    console.error(err);
  }
};

  if (loading) return <div className="p-6">Loading...</div>;
  if (!test) return <div className="p-6">Test not found</div>;

  const currentSection = test.sections.find(
  (s: any) => s.id === selectedSection
);

const questions = currentSection?.questions || [];

  

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{test.name} - Builder</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/college/tests/${id}/preview`)}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Preview
          </button>
        </div>
      </div>

      {/* SECTION SELECTOR */}
      <div className="flex gap-3">
        {test.sections.map((s: any) => (
          <button
            key={s.sectionId}
            onClick={() => setSelectedSection(s.sectionId)}
            className={`px-4 py-2 rounded ${
              selectedSection === s.sectionId
                ? "bg-emerald-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {s.section?.sectionName}
          </button>
        ))}
      </div>
{/* QUESTIONS LIST */}
<div className="space-y-4">
  {questions.length === 0 && (
    <p>No questions added yet.</p>
  )}

  {questions.map((q: any, index: number) => (
    <div
      key={q.id}
      className="border rounded-lg p-4 bg-white flex justify-between items-center"
    >
      <div>
        <div className="font-medium">
          Q{index + 1}. {q.questionText}
        </div>
        <div className="text-sm text-gray-500">
          Marks: {q.marks} | Negative: {q.negativeMarks}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={async () => {
            if (index > 0) {
              await api.patch(`/tests/questions/${q.id}/reorder`, {
                newOrder: index,
              });
              fetchBuilder();
            }
          }}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          ↑
        </button>

        <button
          onClick={async () => {
            if (index < questions.length - 1) {
              await api.patch(`/tests/questions/${q.id}/reorder`, {
                newOrder: index + 2,
              });
              fetchBuilder();
            }
          }}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          ↓
        </button>

        <button
          onClick={async () => {
            await api.delete(
              `/tests/${id}/questions/${q.id}`
            );
            fetchBuilder();
          }}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Remove
        </button>
      </div>
    </div>
  ))}
</div>

      {/* ADD QUESTION */}
      <div>
        <button
  onClick={() => {
    setShowAddModal(true);
    fetchQuestions();
  }}
  className="px-4 py-2 bg-emerald-500 text-white rounded"
>
  + Add Question
</button>
      </div>

      {questions.length === 0 && <p>No questions added yet.</p>}

{questions.map((q: any, index: number) => (
  <div key={q.id} className="border rounded-lg p-4 bg-white flex justify-between items-center">
    <div>
      <div className="font-medium">
        Q{index + 1}. {q.questionText}
      </div>
      <div className="text-sm text-gray-500">
        Marks: {q.marks} | Negative: {q.negativeMarks}
      </div>
    </div>

    <div className="flex gap-2">
      <button
        onClick={async () => {
          await api.patch(`/tests/questions/${q.id}/reorder`, {
            newOrder: index
          });
          fetchBuilder();
        }}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        ↑
      </button>

      <button
        onClick={async () => {
          await api.patch(`/tests/questions/${q.id}/reorder`, {
            newOrder: index + 2
          });
          fetchBuilder();
        }}
        className="px-2 py-1 bg-gray-200 rounded"
      >
        ↓
      </button>

      <button
        onClick={async () => {
          await api.delete(
            `/tests/${id}/questions/${q.id}`
          );
          fetchBuilder();
        }}
        className="px-2 py-1 bg-red-500 text-white rounded"
      >
        Remove
      </button>
    </div>
  </div>
))}
    </div>
  );
}