"use client";

import { useState } from "react";
import api from "@/interceptors/axios";

const languageOptions = ["cpp", "java", "python", "javascript"];

export default function CodingQuestionForm({ sectionId, onQuestionSaved }: { sectionId: string, onQuestionSaved: (data?: any) => void }) {
  const [form, setForm] = useState({
    difficulty: "EASY" as "EASY" | "MEDIUM" | "HARD",
    questionText: "",
    marks: 10,
    order: 1,

    constraints: "",
    inputFormat: "",
    outputFormat: "",
    sampleInput: "",
    sampleOutput: "",
    testCases: [] as { input: string; expectedOutput: string }[],
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    allowedLanguages: [] as string[],
  });

  const addTestCase = () => {
    setForm({
      ...form,
      testCases: [...form.testCases, { input: "", expectedOutput: "" }],
    });
  };

  const updateTestCase = (
    index: number,
    field: "input" | "expectedOutput",
    value: string
  ) => {
    const updated = [...form.testCases];
    updated[index][field] = value;
    setForm({ ...form, testCases: updated });
  };

  const removeTestCase = (index: number) => {
    const updated = form.testCases.filter((_, i) => i !== index);
    setForm({ ...form, testCases: updated });
  };

  const handleSubmit = async () => {
  const res = await api.post("/questions", {
    sectionId,
    type: "CODING",
    difficulty: form.difficulty,
    questionText: form.questionText,
    marks: form.marks,
    order: form.order,
    codingMeta: {
      constraints: form.constraints,
      inputFormat: form.inputFormat,
      outputFormat: form.outputFormat,
      sampleInput: form.sampleInput,
      sampleOutput: form.sampleOutput,
      testCases: form.testCases,
      timeLimitMs: form.timeLimitMs,
      memoryLimitMb: form.memoryLimitMb,
      allowedLanguages: form.allowedLanguages,
    },
  });

  // 👇 This is the important line
  if (onQuestionSaved) onQuestionSaved(res.data);

  alert("Coding question created successfully");
};

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">Create Coding Question</h2>

      {/* Difficulty Dropdown */}
      <select
        value={form.difficulty}
        className="w-full border p-2"
        onChange={(e) =>
          setForm({
            ...form,
            difficulty: e.target.value as "EASY" | "MEDIUM" | "HARD",
          })
        }
      >
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>

      {/* Problem Statement */}
      <textarea
        placeholder="Problem Statement"
        className="w-full border p-2"
        onChange={(e) =>
          setForm({ ...form, questionText: e.target.value })
        }
      />

      <textarea
        placeholder="Constraints"
        className="w-full border p-2"
        onChange={(e) =>
          setForm({ ...form, constraints: e.target.value })
        }
      />

      <textarea
        placeholder="Input Format"
        className="w-full border p-2"
        onChange={(e) =>
          setForm({ ...form, inputFormat: e.target.value })
        }
      />

      <textarea
        placeholder="Output Format"
        className="w-full border p-2"
        onChange={(e) =>
          setForm({ ...form, outputFormat: e.target.value })
        }
      />

      <textarea
        placeholder="Sample Input"
        className="w-full border p-2"
        onChange={(e) =>
          setForm({ ...form, sampleInput: e.target.value })
        }
      />

      <textarea
        placeholder="Sample Output"
        className="w-full border p-2"
        onChange={(e) =>
          setForm({ ...form, sampleOutput: e.target.value })
        }
      />

      {/* Test Cases */}
      <div>
        <h3 className="font-semibold">Test Cases</h3>

        {form.testCases.map((tc, index) => (
          <div key={index} className="border p-3 mt-2">
            <textarea
              placeholder="Input"
              className="w-full border p-2"
              onChange={(e) =>
                updateTestCase(index, "input", e.target.value)
              }
            />
            <textarea
              placeholder="Expected Output"
              className="w-full border p-2 mt-2"
              onChange={(e) =>
                updateTestCase(index, "expectedOutput", e.target.value)
              }
            />
            <button
              className="text-red-500 mt-2"
              onClick={() => removeTestCase(index)}
            >
              Delete
            </button>
          </div>
        ))}

        <button
          className="bg-blue-500 text-white px-4 py-2 mt-2"
          onClick={addTestCase}
        >
          Add Test Case
        </button>
      </div>

      {/* Execution Limits */}
      <input
        type="number"
        placeholder="Time Limit (ms)"
        className="w-full border p-2"
        onChange={(e) =>
          setForm({ ...form, timeLimitMs: Number(e.target.value) })
        }
      />

      <input
        type="number"
        placeholder="Memory Limit (MB)"
        className="w-full border p-2"
        onChange={(e) =>
          setForm({ ...form, memoryLimitMb: Number(e.target.value) })
        }
      />

      {/* Allowed Languages */}
      <div>
        <label className="font-semibold">Allowed Languages</label>

        <div className="flex gap-4 mt-2">
          {languageOptions.map((lang) => (
            <label key={lang} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.allowedLanguages.includes(lang)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setForm({
                      ...form,
                      allowedLanguages: [...form.allowedLanguages, lang],
                    });
                  } else {
                    setForm({
                      ...form,
                      allowedLanguages: form.allowedLanguages.filter(
                        (l) => l !== lang
                      ),
                    });
                  }
                }}
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Save Coding Question
      </button>
    </div>
  );
}