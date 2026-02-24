"use client";

import { useState, useEffect } from "react";
import api from "@/interceptors/axios";

type SubQuestion = {
  id: string;
  type: "TEXT" | "MCQ_SINGLE" | "MCQ_MULTIPLE";
  questionText: string;
  marks: number;
  options?: string[];
  correctAnswer?: string | string[];
};

export default function UnseenParagraphForm({
  sectionId,
  onQuestionSaved,
  passages = [],
}: {
  sectionId: string;
  onQuestionSaved: () => void;
  passages?: { id: string; passage: string; subQuestions?: SubQuestion[] }[];
}) {
  const [selectedPassageId, setSelectedPassageId] = useState("");
  const isEditing = Boolean(selectedPassageId);
  const [passage, setPassage] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [subQuestions, setSubQuestions] = useState<SubQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalMarks = subQuestions.reduce((sum, q) => sum + q.marks, 0);

  // Load existing passage if selected
  useEffect(() => {
    if (!selectedPassageId) {
      setPassage("");
      setSubQuestions([]);
      return;
    }

    const existing = passages.find(p => p.id === selectedPassageId);
    if (existing) {
      setPassage(existing.passage);
      setSubQuestions(existing.subQuestions || []);
    }
  }, [selectedPassageId]);

  const addSubQuestion = (type: SubQuestion["type"]) => {
    setSubQuestions(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        questionText: "",
        marks: 1,
        options:
          type === "TEXT" ? undefined : ["Option 1", "Option 2"],
        correctAnswer:
          type === "MCQ_MULTIPLE" ? [] :
          type === "MCQ_SINGLE" ? "" :
          undefined,
      },
    ]);
  };

  const updateSubQuestion = (id: string, updates: Partial<SubQuestion>) => {
    setSubQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const removeSubQuestion = (id: string) => {
    setSubQuestions(prev => prev.filter(q => q.id !== id));
  };

  const moveSubQuestion = (index: number, direction: "up" | "down") => {
  setSubQuestions(prev => {
    const updated = [...prev];

    if (direction === "up" && index > 0) {
      [updated[index - 1], updated[index]] =
        [updated[index], updated[index - 1]];
    }

    if (direction === "down" && index < prev.length - 1) {
      [updated[index + 1], updated[index]] =
        [updated[index], updated[index + 1]];
    }

    return updated;
  });
};

  const updateOption = (
  qId: string,
  optionIndex: number,
  value: string
) => {
  setSubQuestions(prev =>
    prev.map(q => {
      if (q.id !== qId) return q;

      const updatedOptions = [...(q.options || [])];
      updatedOptions[optionIndex] = value;

      return { ...q, options: updatedOptions };
    })
  );
};

const addOption = (qId: string) => {
  setSubQuestions(prev =>
    prev.map(q =>
      q.id === qId
        ? { ...q, options: [...(q.options || []), ""] }
        : q
    )
  );
};

const removeOption = (qId: string, optionIndex: number) => {
  setSubQuestions(prev =>
    prev.map(q => {
      if (q.id !== qId) return q;

      const updatedOptions = [...(q.options || [])];
      updatedOptions.splice(optionIndex, 1);

      return { ...q, options: updatedOptions };
    })
  );
};

  const handleSubmit = async () => {
    setError("");

    // Only require passage when creating new
if (!selectedPassageId && !passage.trim()) {
  setError("Passage is required when creating a new unseen passage");
  return;
}

    if (subQuestions.length === 0) {
      setError("At least one sub-question required");
      return;
    }

    for (let i = 0; i < subQuestions.length; i++) {
  const q = subQuestions[i];

  if (!q.marks || q.marks < 1) {
    setError(`Marks must be at least 1 for Sub Question ${i + 1}`);
    return;
  }

  if (!q.questionText.trim()) {
    setError(`Sub Question ${i + 1} text is required`);
    return;
  }

  if (q.type !== "TEXT") {
    if (!q.options || q.options.length < 2) {
      setError(`Sub Question ${i + 1} needs at least 2 options`);
      return;
    }

    if (q.options.some(opt => !opt.trim())) {
      setError(`Sub Question ${i + 1} has empty option`);
      return;
    }

    if (q.type === "MCQ_SINGLE" && !q.correctAnswer) {
      setError(`Select correct answer for Sub Question ${i + 1}`);
      return;
    }

    if (
      q.type === "MCQ_MULTIPLE" &&
      (!Array.isArray(q.correctAnswer) ||
        q.correctAnswer.length === 0)
    ) {
      setError(`Select at least one correct answer for Sub Question ${i + 1}`);
      return;
    }
  }
}

    try {
      setLoading(true);

      if (selectedPassageId) {
        // UPDATE existing unseen paragraph
        await api.patch(`/questions/${selectedPassageId}`, {
          unseenParagraphMeta: {
            passage,
            subQuestions,
          },
          marks: totalMarks,
        });
      } else {
        // CREATE new unseen paragraph
        await api.post("/questions", {
          sectionId,
          type: "UNSEEN_PARAGRAPH",
          difficulty,
          marks: totalMarks,
          allowedFor: "BOTH",
          unseenParagraphMeta: {
            passage,
            subQuestions,
          },
        });
      }

      setSelectedPassageId("");
      setPassage("");
      setSubQuestions([]);
      onQuestionSaved();

    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
      <h2 className="text-lg font-semibold">Unseen Paragraph Builder</h2>
      {isEditing && (
  <p className="text-sm text-blue-600">
    Editing existing passage
  </p>
)}

      {/* Dropdown */}
      {passages.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Add to
          </label>
          <select
            value={selectedPassageId}
            onChange={(e) => setSelectedPassageId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="">+ New Passage</option>
            {passages.map(p => (
              <option key={p.id} value={p.id}>
                {p.passage.length > 80
                  ? p.passage.slice(0, 80) + "…"
                  : p.passage}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Passage */}
      <div>
        <label className="block text-sm font-medium mb-2">Passage</label>
        <textarea
          value={passage}
          disabled={Boolean(selectedPassageId)}
          onChange={(e) => setPassage(e.target.value)}
          className="w-full border rounded-lg p-3 min-h-[150px] disabled:bg-gray-100"
        />
      </div>

      {/* Add Buttons */}
      <div className="flex gap-3">
        <button onClick={() => addSubQuestion("TEXT")} className="px-3 py-1 bg-gray-200 rounded">
          + TEXT
        </button>
        <button onClick={() => addSubQuestion("MCQ_SINGLE")} className="px-3 py-1 bg-gray-200 rounded">
          + MCQ Single
        </button>
        <button onClick={() => addSubQuestion("MCQ_MULTIPLE")} className="px-3 py-1 bg-gray-200 rounded">
          + MCQ Multiple
        </button>
      </div>

      {/* Sub Questions */}
      {subQuestions.map((q, index) => (
        <div key={q.id} className="border p-4 rounded-lg bg-white space-y-3">
          <div className="flex justify-between items-center">
  <h4 className="font-medium">
    Sub Question {index + 1} ({q.type})
  </h4>

  <div className="flex gap-2 items-center">
    {/* Move Up */}
    <button
      type="button"
      disabled={index === 0}
      onClick={() => moveSubQuestion(index, "up")}
      className="px-2 py-1 text-sm border rounded disabled:opacity-40"
    >
      ↑
    </button>

    {/* Move Down */}
    <button
      type="button"
      disabled={index === subQuestions.length - 1}
      onClick={() => moveSubQuestion(index, "down")}
      className="px-2 py-1 text-sm border rounded disabled:opacity-40"
    >
      ↓
    </button>

    {/* Remove */}
    <button
      type="button"
      onClick={() => removeSubQuestion(q.id)}
      className="text-red-500 text-sm"
    >
      Remove
    </button>
  </div>
</div>

          <textarea
            value={q.questionText}
            onChange={(e) =>
              updateSubQuestion(q.id, { questionText: e.target.value })
            }
            className="w-full border rounded-lg p-2"
            placeholder="Question text"
          />

          <div className="flex items-center gap-2">
  <label className="text-sm font-medium">Marks:</label>
  <input
    type="number"
    min={1}
    value={q.marks}
    onChange={(e) =>
      updateSubQuestion(q.id, {
        marks: Math.max(1, Number(e.target.value)),
      })
    }
    className="border w-20 px-2 py-1 rounded"
  />
</div>

          {/* MCQ Options */}
{q.type !== "TEXT" && (
  <div className="space-y-3 mt-3">
    <label className="text-sm font-medium">Options</label>

    {q.options?.map((opt, optIndex) => (
      <div key={optIndex} className="flex items-center gap-2">
        
        {/* Correct Answer Selector */}
        {q.type === "MCQ_SINGLE" ? (
          <input
            type="radio"
            name={`correct-${q.id}`}
            checked={q.correctAnswer === opt}
            onChange={() =>
              updateSubQuestion(q.id, {
                correctAnswer: opt,
              })
            }
          />
        ) : (
          <input
            type="checkbox"
            checked={
              Array.isArray(q.correctAnswer) &&
              q.correctAnswer.includes(opt)
            }
            onChange={(e) => {
              const current = Array.isArray(q.correctAnswer)
                ? [...q.correctAnswer]
                : [];

              if (e.target.checked) {
                current.push(opt);
              } else {
                const idx = current.indexOf(opt);
                if (idx > -1) current.splice(idx, 1);
              }

              updateSubQuestion(q.id, {
                correctAnswer: current,
              });
            }}
          />
        )}

        {/* Option Text */}
        <input
          type="text"
          value={opt}
          onChange={(e) =>
            updateOption(q.id, optIndex, e.target.value)
          }
          className="border rounded px-2 py-1 flex-1"
        />

        <button
          type="button"
          onClick={() =>
            removeOption(q.id, optIndex)
          }
          className="text-red-500"
        >
          ✕
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={() => addOption(q.id)}
      className="text-emerald-600 text-sm"
    >
      + Add Option
    </button>
  </div>
)}
        </div>
      ))}

      <div className="font-semibold">
        Total Marks: {totalMarks}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-5 py-2 bg-emerald-500 text-white rounded-lg"
      >
        {loading ? "Saving..." : isEditing ? "Update Passage" : "Create Passage"}
      </button>
    </div>
  );
}