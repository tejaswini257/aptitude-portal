"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/interceptors/axios";
import { useRouter } from "next/navigation";

/* ============================
   TYPES
============================ */

type Section = {
  id: string;
  sectionName: string;
};

type TestSection = {
  id: string; // testSectionId
  timeLimit: number;
  section: Section;
};

type Option = {
  optionCode: string;
  optionText: string;
};

type Question = {
  id: string;
  questionText: string;
  sectionId: string;
  options: Option[];
};

/* ============================
   COMPONENT
============================ */

export default function AdminTestBuilder() {
  const { id } = useParams();

  /* ============================
     STATE
  ============================ */

  const [testSections, setTestSections] = useState<TestSection[]>([]);
  const [allSections, setAllSections] = useState<Section[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [attachTimeLimit, setAttachTimeLimit] = useState(30);

  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionTime, setNewSectionTime] = useState(30);

  const params = useParams();
  const testId = params.id as string;

  const [form, setForm] = useState({
    sectionId: "",
    questionText: "",
    difficulty: "EASY",
    type: "MCQ",
    marks: 1,
    options: [
      { optionCode: "A", optionText: "" },
      { optionCode: "B", optionText: "" },
    ],
    correctAnswer: "",
  });

  /* ============================
     FETCH FUNCTIONS
  ============================ */

  const fetchAttachedSections = async () => {
    const res = await api.get<TestSection[]>(
      `/sections/test/${testId}`
    );
    setTestSections(res.data);
  };

  const fetchAllSections = async () => {
    const res = await api.get<Section[]>("/sections");
    setAllSections(res.data);
  };

  const fetchQuestions = async () => {
    const res = await api.get<Question[]>(
      `/questions/test/${testId}`
    );
    setQuestions(res.data);
  };

  useEffect(() => {
    if (!testId) return;
    fetchAttachedSections();
    fetchAllSections();
    fetchQuestions();
  }, [testId]);

  /* ============================
     SECTION MANAGEMENT
  ============================ */

  const attachSection = async () => {
    if (!selectedSectionId) return;

    await api.post("/test-sections", {
      testId,
      sectionId: selectedSectionId,
      timeLimit: attachTimeLimit,
    });

    setSelectedSectionId("");
    await fetchAttachedSections();
  };

  const createAndAttachSection = async () => {
    if (!newSectionName.trim()) return;

    const newSection = await api.post("/sections", {
      sectionName: newSectionName,
    });

    await api.post("/test-sections", {
      testId,
      sectionId: newSection.data.id,
      timeLimit: newSectionTime,
    });

    setNewSectionName("");
    await fetchAllSections();
    await fetchAttachedSections();
  };

  const removeSection = async (testSectionId: string) => {
    await api.delete(`/test-sections/${testSectionId}`);
    await fetchAttachedSections();
  };

  /* ============================
     QUESTION LOGIC
  ============================ */

  const addOption = () => {
    const nextLetter = String.fromCharCode(
      65 + form.options.length
    );
    setForm((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        { optionCode: nextLetter, optionText: "" },
      ],
    }));
  };

  const handleAddQuestion = async () => {
    if (!form.sectionId) {
      alert("Select section");
      return;
    }
    if (!form.questionText.trim()) {
      alert("Enter question text");
      return;
    }
    if (!form.correctAnswer) {
      alert("Select correct answer");
      return;
    }

    await api.post("/questions", {
      sectionId: form.sectionId,
      type: form.type,
      difficulty: form.difficulty,
      questionText: form.questionText,
      correctAnswer: form.correctAnswer,
      marks: form.marks,
      allowedFor: "TEST",
      options: form.options.map((opt) => ({
        optionCode: opt.optionCode,
        optionText: opt.optionText,
        isCorrect: opt.optionCode === form.correctAnswer,
      })),
    });

    setForm({
      sectionId: "",
      questionText: "",
      difficulty: "EASY",
      type: "MCQ",
      marks: 1,
      options: [
        { optionCode: "A", optionText: "" },
        { optionCode: "B", optionText: "" },
      ],
      correctAnswer: "",
    });

    await fetchQuestions();
  };

  const handleDeleteQuestion = async (id: string) => {
    await api.delete(`/questions/${id}`);
    await fetchQuestions();
  };

  const handleReorder = async (
    id: string,
    direction: "UP" | "DOWN"
  ) => {
    await api.patch(`/questions/${id}/reorder`, {
      direction,
    });
    await fetchQuestions();
  };



const router = useRouter();

  /* ============================
     RENDER
  ============================ */

  return (
    <div className="space-y-8">

      {/* ============================
         SECTION MANAGEMENT
      ============================ */}


      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-4">
          Sections
        </h2>
        <button
  onClick={() => router.push("/college/tests")}
  className="bg-gray-500 text-white px-4 py-2 rounded"
>
  ← Back to Tests
</button>
       

        {/* Attached Sections */}
        <div className="mb-6">
          {testSections.map((ts) => (
            <div
              key={ts.id}
              className="flex justify-between border-b py-2"
            >
              <div>
                {ts.section.sectionName} (
                {ts.timeLimit} mins)
              </div>
              <button
                className="text-red-600 text-sm"
                onClick={() => removeSection(ts.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Attach Existing */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">
            Attach Existing Section
          </h4>

          <div className="flex gap-2">
            <select
              value={selectedSectionId}
              onChange={(e) =>
                setSelectedSectionId(e.target.value)
              }
              className="border px-3 py-2 rounded w-1/2"
            >
              <option value="">
                Select Section
              </option>
              {allSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.sectionName}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={attachTimeLimit}
              onChange={(e) =>
                setAttachTimeLimit(Number(e.target.value))
              }
              placeholder="Time (mins)"
              className="border px-3 py-2 rounded w-1/4"
            />

            <button
              onClick={attachSection}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Attach
            </button>
          </div>
        </div>

        {/* Create New */}
        <div>
          <h4 className="font-medium mb-2">
            Create New Section
          </h4>

          <div className="flex gap-2">
            <input
              value={newSectionName}
              onChange={(e) =>
                setNewSectionName(e.target.value)
              }
              placeholder="Section Name"
              className="border px-3 py-2 rounded w-1/2"
            />

            <input
              type="number"
              value={newSectionTime}
              onChange={(e) =>
                setNewSectionTime(Number(e.target.value))
              }
              placeholder="Time (mins)"
              className="border px-3 py-2 rounded w-1/4"
            />

            <button
              onClick={createAndAttachSection}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create & Attach
            </button>
          </div>
        </div>
      </div>

      {/* ============================
         ADD QUESTION
      ============================ */}

      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-4">
          Add Question
        </h2>

        <select
          value={form.sectionId}
          onChange={(e) =>
            setForm({
              ...form,
              sectionId: e.target.value,
            })
          }
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="">Select Section</option>
          {testSections.map((ts) => (
            <option
              key={ts.section.id}
              value={ts.section.id}
            >
              {ts.section.sectionName}
            </option>
          ))}
        </select>

        <textarea
          value={form.questionText}
          onChange={(e) =>
            setForm({
              ...form,
              questionText: e.target.value,
            })
          }
          placeholder="Enter question text"
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <div className="flex gap-4 mb-4">
          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm({
                ...form,
                difficulty: e.target.value,
              })
            }
            className="border px-3 py-2 rounded w-1/2"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <input
            type="number"
            value={form.marks}
            onChange={(e) =>
              setForm({
                ...form,
                marks: Number(e.target.value),
              })
            }
            className="border px-3 py-2 rounded w-1/2"
            placeholder="Marks"
          />
        </div>

        <div className="space-y-2 mb-4">
          {form.options.map((opt, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="radio"
                checked={
                  form.correctAnswer === opt.optionCode
                }
                onChange={() =>
                  setForm({
                    ...form,
                    correctAnswer: opt.optionCode,
                  })
                }
              />
              <input
                value={opt.optionText}
                onChange={(e) => {
                  const updated = [...form.options];
                  updated[index].optionText =
                    e.target.value;
                  setForm({
                    ...form,
                    options: updated,
                  });
                }}
                placeholder={`Option ${opt.optionCode}`}
                className="border px-3 py-2 rounded w-full"
              />
            </div>
          ))}
        </div>

        <button
          onClick={addOption}
          className="text-blue-600 mb-4"
        >
          + Add Option
        </button>

        <br />

        <button
          onClick={handleAddQuestion}
          className="bg-emerald-600 text-white px-5 py-2 rounded"
        >
          Add Question
        </button>
      </div>

      {/* ============================
         QUESTIONS LIST
      ============================ */}

      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-4">
          Questions
        </h2>

        {questions.map((q, index) => (
          <div key={q.id} className="mb-4 border-b pb-4">
            <div className="flex justify-between">
              <p>
                {index + 1}. {q.questionText}
              </p>
              <button
                onClick={() =>
                  handleDeleteQuestion(q.id)
                }
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>

            <ul className="ml-6 list-disc">
              {q.options.map((opt) => (
                <li key={opt.optionCode}>
                  {opt.optionCode}. {opt.optionText}
                </li>
              ))}
            </ul>

            <div className="mt-2">
              <button
                onClick={() =>
                  handleReorder(q.id, "UP")
                }
                className="text-blue-600 text-xs mr-2"
              >
                ↑
              </button>
              <button
                onClick={() =>
                  handleReorder(q.id, "DOWN")
                }
                className="text-blue-600 text-xs"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}