"use client";

import { useState } from "react";
import api from "@/interceptors/axios";

interface Props {
  sectionId: string;
  onQuestionSaved?: () => void;
}

export default function PassageWritingForm({
  sectionId,
  onQuestionSaved,
}: Props) {
  const [questionText, setQuestionText] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [marks, setMarks] = useState(5);
  const [allowedFor, setAllowedFor] = useState("BOTH");

  const [minWords, setMinWords] = useState(150);
  const [maxWords, setMaxWords] = useState(300);
  const [allowManualReview, setAllowManualReview] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!questionText.trim()) {
      setError("Question text is required");
      return;
    }

    if (minWords >= maxWords) {
      setError("Max words must be greater than min words");
      return;
    }

    try {
      setLoading(true);

      await api.post("/questions", {
        sectionId,
        type: "PASSAGE_WRITING",
        difficulty,
        questionText,
        marks: Number(marks),
        allowedFor,
        passageWritingMeta: {
          minWords: Number(minWords),
          maxWords: Number(maxWords),
          allowManualReview,
        },
      });

      if (onQuestionSaved) onQuestionSaved();

      // Reset form
      setQuestionText("");
      setMinWords(150);
      setMaxWords(300);
      setMarks(5);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to create question"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border rounded-xl p-6 bg-gray-50 space-y-5">
      <h2 className="text-lg font-semibold">
        Add Passage Writing Question
      </h2>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Question Prompt
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border rounded-lg p-3 h-28"
          placeholder="Enter passage writing question..."
        />
      </div>

      {/* Difficulty + Marks + Allowed */}
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="block text-sm mb-2">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Marks</label>
          <input
            type="number"
            min={1}
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 w-24"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Allowed For</label>
          <select
            value={allowedFor}
            onChange={(e) => setAllowedFor(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="PRACTICE">Practice</option>
            <option value="TEST">Test</option>
            <option value="BOTH">Both</option>
          </select>
        </div>
      </div>

      {/* Word Limits */}
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="block text-sm mb-2">Min Words</label>
          <input
            type="number"
            value={minWords}
            onChange={(e) => setMinWords(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 w-32"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Max Words</label>
          <input
            type="number"
            value={maxWords}
            onChange={(e) => setMaxWords(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 w-32"
          />
        </div>

        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            checked={allowManualReview}
            onChange={(e) =>
              setAllowManualReview(e.target.checked)
            }
          />
          <label className="text-sm">
            Allow Manual Evaluation
          </label>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-5 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Question"}
      </button>
    </div>
  );
}