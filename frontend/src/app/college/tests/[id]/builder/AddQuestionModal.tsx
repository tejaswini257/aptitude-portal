"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";
import { toast } from "react-hot-toast";

export default function AddQuestionModal({
  testId,
  sectionId,
  onClose,
  onAdded,
}: {
  testId: string;
  sectionId: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"bank" | "create">("bank");

  // Bank state
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // Create state
  const [newQuestion, setNewQuestion] = useState({
    type: "MCQ_SINGLE",
    difficulty: "EASY",
    questionText: "",
    marks: 1,
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ],
  });

  useEffect(() => {
    if (activeTab === "bank") {
      fetchQuestions();
    }
  }, [search, type, difficulty, activeTab]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/questions/bank", {
        params: {
          sectionId,
          search,
          type,
          difficulty,
        },
      });
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToTest = async (questionId: string) => {
    try {
      await api.post(`/tests/${testId}/questions`, {
        questionId,
        sectionId,
      });
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add question to test");
    }
  };

  const handleCreateAndAdd = async () => {
    try {
      // 1. Create the question in the bank
      const createRes = await api.post("/questions", {
        sectionId,
        type: newQuestion.type,
        difficulty: newQuestion.difficulty,
        questionText: newQuestion.questionText,
        allowedFor: "BOTH", // Assuming BOTH so it can be used in test and practice
        marks: newQuestion.marks,
        options: newQuestion.options,
      });

      const questionId = createRes.data?.id;
      if (!questionId) throw new Error("Failed to create question");

      // 2. Add to test
      await addToTest(questionId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create and add question");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] max-h-[90vh] overflow-y-auto rounded-lg shadow-xl flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 flex-shrink-0 rounded-t-lg">
          <h2 className="text-xl font-semibold">Add Question</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black font-bold">
            ✕
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 py-3 font-medium ${activeTab === "bank"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-gray-500 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab("bank")}
          >
            Select from Bank
          </button>
          <button
            className={`flex-1 py-3 font-medium ${activeTab === "create"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-gray-500 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab("create")}
          >
            Create New Question
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "bank" && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  placeholder="Search questions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full"
                />

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="border px-2 py-2 rounded-lg"
                >
                  <option value="">All Types</option>
                  <option value="MCQ_SINGLE">MCQ Single</option>
                  <option value="MCQ_MULTIPLE">MCQ Multiple</option>
                  <option value="CODING">Coding</option>
                  <option value="PASSAGE_WRITING">Passage Writing</option>
                  <option value="PASSAGE_DROPDOWN">Dropdown</option>
                  <option value="UNSEEN_PARAGRAPH">Unseen</option>
                </select>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="border px-2 py-2 rounded-lg"
                >
                  <option value="">All Difficulty</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="space-y-3 mt-4">
                {questions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No matching questions found in bank.</p>
                ) : (
                  questions.map((q) => (
                    <div
                      key={q.id}
                      className="border p-4 rounded-lg flex justify-between items-center hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium text-gray-800">
                          {q.questionText || "Unseen Passage"}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {q.type} • {q.difficulty} • {q.marks} Marks
                        </div>
                      </div>

                      <button
                        onClick={() => addToTest(q.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "create" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, type: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="MCQ_SINGLE">MCQ Single</option>
                    <option value="MCQ_MULTIPLE">MCQ Multiple</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, difficulty: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                  <input
                    type="number"
                    value={newQuestion.marks}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, marks: Number(e.target.value) })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                <textarea
                  value={newQuestion.questionText}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, questionText: e.target.value })
                  }
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter the question text here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
                {newQuestion.options.map((opt, i) => (
                  <div key={i} className="flex gap-3 mb-3 items-center">
                    <input
                      type={newQuestion.type === "MCQ_SINGLE" ? "radio" : "checkbox"}
                      name="isCorrect"
                      checked={opt.isCorrect}
                      onChange={(e) => {
                        const newOpts = [...newQuestion.options];
                        if (newQuestion.type === "MCQ_SINGLE") {
                          newOpts.forEach((o) => (o.isCorrect = false));
                        }
                        newOpts[i].isCorrect = e.target.checked;
                        setNewQuestion({ ...newQuestion, options: newOpts });
                      }}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <input
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...newQuestion.options];
                        newOpts[i].text = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOpts });
                      }}
                      className="flex-1 border rounded-lg px-3 py-2"
                      placeholder={`Option ${i + 1}`}
                    />
                    <button
                      onClick={() => {
                        const newOpts = newQuestion.options.filter((_, idx) => idx !== i);
                        setNewQuestion({ ...newQuestion, options: newOpts });
                      }}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setNewQuestion({
                      ...newQuestion,
                      options: [...newQuestion.options, { text: "", isCorrect: false }],
                    });
                  }}
                  className="text-emerald-600 font-medium text-sm hover:underline mt-2 inline-block"
                >
                  + Add Option
                </button>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={handleCreateAndAdd}
                  disabled={!newQuestion.questionText.trim() || newQuestion.options.length < 2}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
                >
                  Create & Add to Test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}