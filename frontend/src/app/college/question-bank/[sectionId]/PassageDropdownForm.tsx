"use client";

import { useState } from "react";
import api from "@/interceptors/axios";

interface Blank {
  id: string;
  marks: number;
  options: string[];
  correctAnswer: string;
}

interface Props {
  sectionId: string;
  onQuestionSaved?: (data?: any) => void;
}

export default function PassageDropdownForm({
  sectionId,
  onQuestionSaved,
}: Props) {
  const [questionText, setQuestionText] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [allowedFor, setAllowedFor] = useState("BOTH");
  const [content, setContent] = useState("");

  const [blanks, setBlanks] = useState<Blank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 

  /* ===================== BLANK MANAGEMENT ===================== */

  const addBlank = () => {
    const newId = `blank${blanks.length + 1}`;
    setBlanks([
      ...blanks,
      { id: newId, marks: 1, options: [], correctAnswer: "" },
    ]);
  };

  const updateBlank = (
    index: number,
    field: keyof Blank,
    value: any
  ) => {
    const updated = [...blanks];
    updated[index] = { ...updated[index], [field]: value };
    setBlanks(updated);
  };

  const removeBlank = (index: number) => {
    const updated = blanks.filter((_, i) => i !== index);
    setBlanks(updated);
  };

  const addOption = (blankIndex: number) => {
    const updated = [...blanks];
    updated[blankIndex].options.push("");
    setBlanks(updated);
  };

  const updateOption = (
    blankIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...blanks];
    updated[blankIndex].options[optionIndex] = value;
    setBlanks(updated);
  };

  const removeOption = (
    blankIndex: number,
    optionIndex: number
  ) => {
    const updated = [...blanks];
    updated[blankIndex].options.splice(optionIndex, 1);
    setBlanks(updated);
  };

  /* ===================== VALIDATION ===================== */

  const validate = () => {
  if (blanks.length === 0) {
    return "At least one blank is required";
  }
  // Ensure each configured blank is used in content
for (let i = 0; i < blanks.length; i++) {
  const placeholder = `{{${blanks[i].id}}}`;

  if (!content.includes(placeholder)) {
    return `Passage is missing placeholder ${placeholder}`;
  }
}

// STEP 4: Ensure no orphan placeholders exist
const placeholderMatches = content.match(/{{(.*?)}}/g) || [];

for (const match of placeholderMatches) {
  const id = match.replace("{{", "").replace("}}", "");

  const exists = blanks.some((b) => b.id === id);

  if (!exists) {
    return `Placeholder ${match} has no blank configuration`;
  }
}

  for (let i = 0; i < blanks.length; i++) {
    const blank = blanks[i];

    if (!blank.options || blank.options.length < 2) {
      return `Blank ${i + 1} must have at least 2 options`;
    }

    const hasEmptyOption = blank.options.some(
      (opt: string) => !opt.trim()
    );

    if (hasEmptyOption) {
      return `Blank ${i + 1} has empty option`;
    }

    if (!blank.correctAnswer) {
      return `Select correct answer for Blank ${i + 1}`;
    }

    if (!blank.marks || blank.marks < 1) {
      return `Marks missing for Blank ${i + 1}`;
    }
  }

  return null;
};
 const validationError = validate();
const isValid = !validationError && content.trim().length > 0;
  /* ===================== SUBMIT ===================== */

  const handleSubmit = async () => {
    setError("");

    if (!content.trim()) {
    setError("Passage content is required");
    return;
  }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const totalMarks = blanks.reduce(
      (sum, b) => sum + Number(b.marks),
      0
    );

    try {
      setLoading(true);

      const res = await api.post("/questions", {
        sectionId,
        type: "PASSAGE_DROPDOWN",
        difficulty,
        questionText,
        allowedFor,
        marks: totalMarks,
        passageDropdownMeta: {
          content,
          blanks,
        },
      });

      if (onQuestionSaved) onQuestionSaved(res.data);

      // Reset
      setQuestionText("");
      setContent("");
      setBlanks([]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create question"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className="mt-6 border rounded-xl p-6 bg-gray-50 space-y-6">
      <h2 className="text-lg font-semibold">
        Add Passage Dropdown Question
      </h2>

      {/* Question Prompt */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Question Prompt
        </label>
        <textarea
          value={questionText}
          onChange={(e) =>
            setQuestionText(e.target.value)
          }
          className="w-full border rounded-lg p-3 h-24"
        />
      </div>

      {/* Difficulty & Allowed */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>

        <select
          value={allowedFor}
          onChange={(e) =>
            setAllowedFor(e.target.value)
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="PRACTICE">Practice</option>
          <option value="TEST">Test</option>
          <option value="BOTH">Both</option>
        </select>
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Passage Content (Use {"{{blankId}}"} syntax)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded-lg p-3 h-32"
          placeholder="The capital of France is {{blank1}}..."
        />
      </div>

      {/* Blank Manager */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">
            Blanks Configuration
          </h3>
          <button
            type="button"
            onClick={addBlank}
            className="text-emerald-600 text-sm"
          >
            + Add Blank
          </button>
        </div>

        {blanks.map((blank, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-white space-y-3"
          >
            <div className="flex justify-between">
              <strong>{blank.id}</strong>
              <button
                onClick={() => removeBlank(index)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>


            <div>
              <label className="text-sm font-medium">
                Options
              </label>

              {blank.options.map(
                (opt, optIndex) => (
                  <div
                    key={optIndex}
                    className="flex gap-2 mt-2"
                  >
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        updateOption(
                          index,
                          optIndex,
                          e.target.value
                        )
                      }
                      className="border rounded-lg px-3 py-1 flex-1"
                    />
                    <button
                      onClick={() =>
                        removeOption(
                          index,
                          optIndex
                        )
                      }
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                )
              )}

              <button
                onClick={() =>
                  addOption(index)
                }
                className="text-emerald-600 text-sm mt-2"
              >
                + Add Option
              </button>
            </div>

            <div>
              <label className="text-sm font-medium">
                Correct Answer
              </label>
              <select
                value={blank.correctAnswer}
                onChange={(e) =>
                  updateBlank(
                    index,
                    "correctAnswer",
                    e.target.value
                  )
                }
                className="border rounded-lg px-3 py-2 ml-2"
              >
                <option value="">
                  Select correct
                </option>
                {blank.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

      <button
  type="button"
  onClick={handleSubmit}
  disabled={!isValid || loading}
  className="px-5 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
>
  {loading ? "Saving..." : "Save Question"}
</button>
    </div>
  );
}