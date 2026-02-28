"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";
import CodingQuestionForm from "@/app/college/question-bank/[sectionId]/CodingQuestionForm";
import MCQQuestionForm from "@/app/college/question-bank/[sectionId]/MCQQuestionForm";
import PassageWritingForm from "@/app/college/question-bank/[sectionId]/PassageWritingForm";
import PassageDropdownForm from "@/app/college/question-bank/[sectionId]/PassageDropdownForm";
import UnseenParagraphForm from "@/app/college/question-bank/[sectionId]/UnseenParagraphForm";

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

  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [filterBankId, setFilterBankId] = useState("");
  const [questionBanks, setQuestionBanks] = useState<any[]>([]);
  const [selectedCreateType, setSelectedCreateType] = useState<
    "MCQ" | "CODING" | "PASSAGE_WRITING" | "PASSAGE_DROPDOWN" | "UNSEEN_PARAGRAPH"
  >("MCQ");

  // Create state
  const [newQuestion, setNewQuestion] = useState({
    type: "MCQ_SINGLE",
    difficulty: "EASY",
    questionText: "",
    marks: 1,
    selectedBankId: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ],
  });

  useEffect(() => {
    fetchQuestionBanks();
  }, []);

  const fetchQuestionBanks = async () => {
    try {
      const res = await api.get("/sections?isQuestionBank=true");
      setQuestionBanks(res.data);
      if (res.data?.length > 0) {
        setNewQuestion(prev => ({ ...prev, selectedBankId: res.data[0].id }));
      }
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (activeTab === "bank") {
      fetchQuestions();
    }
  }, [search, type, difficulty, filterBankId, activeTab]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/questions/bank", {
        params: {
          sectionId: filterBankId || undefined,
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
      alert("Failed to add question to test");
    }
  };

  const handleCreateAndAdd = async () => {
    try {
      // If a bank is selected, save there, otherwise save directly to test section
      const targetSectionId = newQuestion.selectedBankId || sectionId;

      // 1. Create the question in the target section
      const createRes = await api.post("/questions", {
        sectionId: targetSectionId,
        type: newQuestion.type,
        difficulty: newQuestion.difficulty,
        questionText: newQuestion.questionText,
        allowedFor: "BOTH", // Assuming BOTH so it can be used in test and practice
        marks: newQuestion.marks,
        options: newQuestion.options,
      });

      const questionId = createRes.data?.id;
      if (!questionId) throw new Error("Failed to create question");

      // 2. Add to test (Always required because tests read from TestQuestion table)
      await addToTest(questionId);
    } catch (err) {
      console.error(err);
      alert("Failed to create and add question");
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
            className={`flex-1 py-3 font-medium ${
              activeTab === "bank"
                ? "border-b-2 border-emerald-600 text-emerald-600"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("bank")}
          >
            Select from Bank
          </button>
          <button
            className={`flex-1 py-3 font-medium ${
              activeTab === "create"
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
                  value={filterBankId}
                  onChange={(e) => setFilterBankId(e.target.value)}
                  className="border px-2 py-2 rounded-lg"
                >
                  <option value="">All Question Banks</option>
                  {questionBanks.map((qb) => (
                    <option key={qb.id} value={qb.id}>{qb.sectionName}</option>
                  ))}
                </select>

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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Save to Question Bank (Optional)</label>
                <select
                  value={newQuestion.selectedBankId}
                  onChange={(e) => setNewQuestion({ ...newQuestion, selectedBankId: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- None (Save directly to this test section) --</option>
                  {questionBanks.map((qb) => (
                    <option key={qb.id} value={qb.id}>{qb.sectionName}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Question Type to Add
                </label>
                <select
                  value={selectedCreateType}
                  onChange={(e) => setSelectedCreateType(e.target.value as any)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="CODING">Coding</option>
                  <option value="PASSAGE_WRITING">Passage Writing</option>
                  <option value="PASSAGE_DROPDOWN">Passage Dropdown</option>
                  <option value="UNSEEN_PARAGRAPH">Unseen Paragraph</option>
                </select>
              </div>

              <div className="mt-4 border-t pt-4">
                {selectedCreateType === "MCQ" && (
                  <MCQQuestionForm
                    sectionId={newQuestion.selectedBankId || sectionId}
                    mode="create"
                    onQuestionSaved={(data) => {
                      if (data?.id) addToTest(data.id);
                    }}
                  />
                )}
                {selectedCreateType === "CODING" && (
                  <CodingQuestionForm
                    sectionId={newQuestion.selectedBankId || sectionId}
                    onQuestionSaved={(data) => {
                      if (data?.id) addToTest(data.id);
                    }}
                  />
                )}
                {selectedCreateType === "PASSAGE_WRITING" && (
                  <PassageWritingForm
                    sectionId={newQuestion.selectedBankId || sectionId}
                    onQuestionSaved={(data) => {
                      if (data?.id) addToTest(data.id);
                    }}
                  />
                )}
                {selectedCreateType === "PASSAGE_DROPDOWN" && (
                  <PassageDropdownForm
                    sectionId={newQuestion.selectedBankId || sectionId}
                    onQuestionSaved={(data) => {
                      if (data?.id) addToTest(data.id);
                    }}
                  />
                )}
                {selectedCreateType === "UNSEEN_PARAGRAPH" && (
                  <UnseenParagraphForm
                    sectionId={newQuestion.selectedBankId || sectionId}
                    onQuestionSaved={(data) => {
                      if (data?.id) addToTest(data.id);
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}