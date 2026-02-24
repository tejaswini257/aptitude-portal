"use client";

import { useState } from "react";
import api from "@/interceptors/axios";

export default function MCQQuestionForm({
  sectionId,
  onQuestionSaved,
  mode = "create",
  initialData,
  questionId,
}: {
  sectionId: string;
  onQuestionSaved: () => void;
  mode?: "create" | "edit";
  initialData?: any;
  questionId?: string;
}) {
  const [questionText, setQuestionText] = useState(
    initialData?.questionText || ""
  );
  const [difficulty, setDifficulty] = useState(
    initialData?.difficulty || "EASY"
  );
  const [marks, setMarks] = useState(initialData?.marks ?? 1);
  const [mcqType, setMcqType] = useState(
    initialData?.type || "MCQ_SINGLE"
  );
  const [allowedFor, setAllowedFor] = useState(
    initialData?.allowedFor || "BOTH"
  );
  const [options, setOptions] = useState(
    initialData?.options?.map((opt: any) => ({
      text: opt.optionText,
      isCorrect: opt.isCorrect,
    })) || [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: string, value: any) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };

    if (mcqType === "MCQ_SINGLE" && field === "isCorrect" && value === true) {
      updated.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }

    setOptions(updated);
  };

  const handleSubmit = async () => {
    setError("");

    if (!questionText.trim()) {
      setError("Question text is required");
      return;
    }

    const validOptions = options.filter((o) => o.text.trim());
    if (validOptions.length < 2) {
      setError("Add at least 2 options");
      return;
    }

    const hasCorrect = validOptions.some((o) => o.isCorrect);
    if (!hasCorrect) {
      setError("Select the correct answer(s)");
      return;
    }

    if (mcqType === "MCQ_SINGLE" && validOptions.filter((o) => o.isCorrect).length > 1) {
      setError("Single correct mode allows only one correct answer");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        sectionId,
        questionText,
        difficulty,
        marks,
        type: mcqType,
        allowedFor,
        options: validOptions,
      };

      if (mode === "create") {
  await api.post("/questions", payload);

  // 🔥 RESET FORM
  setQuestionText("");
  setMarks(1);
  setDifficulty("EASY");
  setMcqType("MCQ_SINGLE");
  setAllowedFor("BOTH");
  setOptions([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

} else {
  await api.patch(`/questions/${questionId}`, payload);
}

onQuestionSaved();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 bg-gray-50 space-y-5">
      <h2 className="text-lg font-semibold">
        {mode === "edit" ? "Edit MCQ Question" : "Add MCQ Question"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Text
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border rounded-lg p-3 h-24"
          placeholder="Enter the question..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marks
          </label>
          <input
            type="number"
            min={1}
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Answer type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mcqType"
              checked={mcqType === "MCQ_SINGLE"}
              onChange={() => setMcqType("MCQ_SINGLE")}
            />
            <span>Single correct</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mcqType"
              checked={mcqType === "MCQ_MULTIPLE"}
              onChange={() => setMcqType("MCQ_MULTIPLE")}
            />
            <span>Multiple correct</span>
          </label>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Options
          </label>
          <button
            type="button"
            onClick={addOption}
            className="text-sm text-emerald-600 hover:underline font-medium"
          >
            + Add option
          </button>
        </div>
        <div className="space-y-3">
          {options.map((opt, index) => (
            <div
              key={index}
              className="flex gap-2 items-center p-3 bg-white border rounded-lg"
            >
              <span className="text-sm font-medium text-gray-500 w-6">
                {String.fromCharCode(65 + index)}.
              </span>
              <input
                value={opt.text}
                onChange={(e) =>
                  updateOption(index, "text", e.target.value)
                }
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
              />
              <label className="flex items-center gap-1 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opt.isCorrect}
                  onChange={(e) =>
                    updateOption(index, "isCorrect", e.target.checked)
                  }
                />
                <span className="text-sm text-gray-600">Correct</span>
              </label>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-500 hover:text-red-700 text-sm px-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Question"}
      </button>
    </div>
  );
}
