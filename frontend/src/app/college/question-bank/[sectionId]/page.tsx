"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/interceptors/axios";
import CodingQuestionForm from "./CodingQuestionForm";
import MCQQuestionForm from "./MCQQuestionForm";
import PassageWritingForm from "./PassageWritingForm";
import PassageDropdownForm from "./PassageDropdownForm";
import UnseenParagraphForm from "./UnseenParagraphForm";

interface Section {
  id: string;
  sectionName: string;
  description?: string;
  type: "MCQ" | "CODING" | "PASSAGE_WRITING" | "PASSAGE_DROPDOWN" | "UNSEEN_PARAGRAPH";
  questions: any[];
}

export default function SectionDetailPage() {
  const params = useParams();
  const sectionId = params.sectionId as string;
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editSection, setEditSection] = useState(false);
  const [sectionNameEdit, setSectionNameEdit] = useState("");
  const [descriptionEdit, setDescriptionEdit] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<
    "MCQ" | "CODING" | "PASSAGE_WRITING" | "PASSAGE_DROPDOWN" | "UNSEEN_PARAGRAPH"
  >("MCQ");

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    try {
      const res = await api.get(`/sections/${sectionId}`);
      setSection(res.data);
    } catch {
      setError("Failed to load section");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!section) return <div className="p-6">Section not found</div>;

  return (
  <div className="p-6 space-y-6">

    {/* ================= HEADER ================= */}
    <div className="flex justify-between items-start">
      <div>
        {!editSection ? (
          <>
            <h1 className="text-2xl font-semibold">{section.sectionName}</h1>
            {section.description && (
              <p className="text-gray-600 text-sm mt-1">{section.description}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">Type: {section.type}</p>
          </>
        ) : (
          <div className="space-y-2">
            <input
              value={sectionNameEdit}
              onChange={(e) => setSectionNameEdit(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full max-w-md text-lg font-semibold"
              placeholder="Section name"
            />
            <textarea
              value={descriptionEdit}
              onChange={(e) => setDescriptionEdit(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full max-w-md text-sm resize-none h-20"
              placeholder="Description (optional)"
            />
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  try {
                    await api.patch(`/sections/${section.id}`, {
                      sectionName: sectionNameEdit.trim(),
                      description: descriptionEdit.trim() || undefined,
                    });
                    setEditSection(false);
                    fetchSection();
                  } catch (err: any) {
                    alert(err?.response?.data?.message || "Failed to update");
                  }
                }}
                className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditSection(false);
                  setSectionNameEdit(section.sectionName);
                  setDescriptionEdit(section.description || "");
                }}
                className="px-3 py-1.5 border rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!editSection && (
          <button
            onClick={() => {
              setEditSection(true);
              setSectionNameEdit(section.sectionName);
              setDescriptionEdit(section.description || "");
            }}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Edit Section
          </button>
        )}
        <button
          onClick={() => {
            if (section.questions.length === 0) {
              setShowCancelModal(true);
            } else {
              router.back();
            }
          }}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          ← Back
        </button>
      </div>
    </div>

    {/* ================= BUILDER ================= */}
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Question Type to Add
        </label>
        <select
          value={selectedQuestionType}
          onChange={(e) => setSelectedQuestionType(e.target.value as any)}
          className="w-full max-w-sm border rounded-lg px-3 py-2"
        >
          <option value="MCQ">MCQ</option>
          <option value="CODING">Coding</option>
          <option value="PASSAGE_WRITING">Passage Writing</option>
          <option value="PASSAGE_DROPDOWN">Passage Dropdown</option>
          <option value="UNSEEN_PARAGRAPH">Unseen Paragraph</option>
        </select>
      </div>

      <div className="mt-4 border-t pt-4">
        {selectedQuestionType === "MCQ" && (
          <MCQQuestionForm
            sectionId={section.id}
            mode="create"
            onQuestionSaved={fetchSection}
          />
        )}

        {selectedQuestionType === "CODING" && (
          <CodingQuestionForm
            sectionId={sectionId}
            onQuestionSaved={fetchSection}
          />
        )}

        {selectedQuestionType === "PASSAGE_WRITING" && (
          <PassageWritingForm
            sectionId={section.id}
            onQuestionSaved={fetchSection}
          />
        )}

        {selectedQuestionType === "PASSAGE_DROPDOWN" && (
          <PassageDropdownForm
            sectionId={section.id}
            onQuestionSaved={fetchSection}
          />
        )}

        {selectedQuestionType === "UNSEEN_PARAGRAPH" && (
          <UnseenParagraphForm
            sectionId={section.id}
            passages={(section.questions || [])
              .filter((q: any) => q?.unseenParagraphMeta?.passage)
              .map((q: any) => ({
                id: q.id,
                passage: q.unseenParagraphMeta.passage,
              }))}
            onQuestionSaved={fetchSection}
          />
        )}
      </div>
    </div>

    {/* ================= QUESTION LIST ================= */}
    {section.questions.length > 0 && (
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Saved Questions
        </h2>

        {section.type === "UNSEEN_PARAGRAPH" ? (
          (() => {
            const questions: any[] = section.questions || [];

            const groups = new Map<
              string,
              { parent: any; passage: string; items: any[] }
            >();

            // Parent passage holders (have unseenParagraphMeta)
            for (const q of questions) {
              if (q?.unseenParagraphMeta?.passage) {
                groups.set(q.id, {
                  parent: q,
                  passage: q.unseenParagraphMeta.passage,
                  items: q.questionText?.trim() ? [q] : [], // legacy: question stored on same record
                });
              }
            }

            // Child questions
            for (const q of questions) {
              if (!q?.parentQuestionId) continue;
              const parentId = q.parentQuestionId;
              const existing = groups.get(parentId);
              const passageFromParent =
                existing?.passage ??
                q?.parentQuestion?.unseenParagraphMeta?.passage ??
                "";
              if (!existing) {
                groups.set(parentId, {
                  parent: q.parentQuestion ?? { id: parentId },
                  passage: passageFromParent,
                  items: [q],
                });
              } else {
                existing.items.push(q);
              }
            }

            const sortedGroups = Array.from(groups.values()).sort((a, b) => {
              const ao = a.parent?.order ?? 0;
              const bo = b.parent?.order ?? 0;
              return ao - bo;
            });

            return (
              <div className="space-y-5">
                {sortedGroups.map((g) => (
                  <div
                    key={g.parent?.id ?? g.passage}
                    className="border rounded-xl p-4 bg-white"
                  >
                    <div className="text-sm font-semibold mb-2">Passage</div>
                    <div className="p-3 bg-gray-50 rounded border text-sm text-gray-700 whitespace-pre-wrap">
                      {g.passage || "(No passage text found)"}{" "}
                    </div>

                    <div className="mt-4">
                      <div className="text-sm font-semibold mb-2">
                        Questions
                      </div>

                      {g.items.length === 0 ? (
                        <div className="text-sm text-gray-500">
                          No questions yet. Use the form above to add one.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {g.items.map((q) => (
                            <div
                              key={q.id}
                              className="border rounded-lg p-3 bg-white"
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold">
                                    {q.questionText}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {q.difficulty} • {q.marks} Marks
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button
                                    onClick={async () => {
                                      if (!confirm("Delete this question?"))
                                        return;
                                      try {
                                        await api.delete(`/questions/${q.id}`);
                                        fetchSection();
                                      } catch (err: any) {
                                        alert(
                                          err?.response?.data?.message ||
                                            "Failed to delete"
                                        );
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        ) : (
          <>
            {section.questions.map((q, index) => (
              <div
                key={q.id}
                className="border rounded-lg p-4 mb-4 bg-white hover:shadow-sm transition"
              >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{q.questionText}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {q.difficulty} • {q.marks} Marks
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={async () => {
                    try {
                      await api.patch(`/questions/${q.id}/reorder`, {
                        direction: "UP",
                      });
                      fetchSection();
                    } catch {
                      // already first
                    }
                  }}
                  disabled={index === 0}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={async () => {
                    try {
                      await api.patch(`/questions/${q.id}/reorder`, {
                        direction: "DOWN",
                      });
                      fetchSection();
                    } catch {
                      // already last
                    }
                  }}
                  disabled={index === section.questions.length - 1}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  title="Move down"
                >
                  ↓
                </button>
                {(section.type === "MCQ" || section.type === "CODING") && (
                  <button
                    onClick={() =>
                      setEditingQuestionId(editingQuestionId === q.id ? null : q.id)
                    }
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    {editingQuestionId === q.id ? "Cancel" : "Edit"}
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (!confirm("Delete this question?")) return;
                    try {
                      await api.delete(`/questions/${q.id}`);
                      fetchSection();
                    } catch (err: any) {
                      alert(err?.response?.data?.message || "Failed to delete");
                    }
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* ===== PASSAGE DROPDOWN PREVIEW ===== */}
            {section.type === "PASSAGE_DROPDOWN" &&
              q.passageDropdownMeta && (
                <div className="space-y-4">

                  {/* Render Passage */}
                  <div className="p-3 bg-gray-50 rounded border text-sm">
                    {q.passageDropdownMeta.content
                      .split(/(\{\{.*?\}\})/)
                      .map(
                        (part: string, index: number) => {
                          if (
                            part.startsWith("{{") &&
                            part.endsWith("}}")
                          ) {
                            return (
                              <span
                                key={index}
                                className="px-2 py-1 mx-1 bg-yellow-200 rounded text-xs font-medium"
                              >
                                {part
                                  .replace("{{", "")
                                  .replace("}}", "")}
                              </span>
                            );
                          }
                          return (
                            <span key={index}>
                              {part}
                            </span>
                          );
                        }
                      )}
                  </div>

                  {/* Blank Details */}
                  <div className="space-y-3">
                    {q.passageDropdownMeta.blanks.map(
                      (blank: any, idx: number) => (
                        <div
                          key={idx}
                          className="border rounded-lg p-3 bg-white"
                        >
                          <div className="flex justify-between text-sm font-medium">
                            <span>{blank.id}</span>
                            <span>
                              {blank.marks} Marks
                            </span>
                          </div>

                          <div className="mt-2 space-y-1">
                            {blank.options.map(
                              (
                                opt: string,
                                optIndex: number
                              ) => (
                                <div
                                  key={optIndex}
                                  className={`text-sm px-2 py-1 rounded ${
                                    opt ===
                                    blank.correctAnswer
                                      ? "bg-emerald-100 text-emerald-700 font-medium"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  {opt}
                                  {opt ===
                                    blank.correctAnswer && (
                                    <span className="ml-2 text-xs">
                                      (Correct)
                                    </span>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* ===== PASSAGE WRITING PREVIEW ===== */}
            {section.type === "PASSAGE_WRITING" &&
              q.passageWritingMeta && (
                <div className="text-sm text-gray-600 mt-2">
                  Word Limit:{" "}
                  {q.passageWritingMeta.minWords} -{" "}
                  {q.passageWritingMeta.maxWords}
                </div>
              )}

            {/* ===== UNSEEN PARAGRAPH PREVIEW ===== */}
            {section.type === "UNSEEN_PARAGRAPH" &&
              q.unseenParagraphMeta && (
                <div className="mt-2 p-3 bg-gray-50 rounded border text-sm text-gray-700">
                  {q.unseenParagraphMeta.passage?.slice(0, 150)}
                  {(q.unseenParagraphMeta.passage?.length ?? 0) > 150 && "…"}
                </div>
              )}

            {/* Edit form for MCQ when editing */}
            {editingQuestionId === q.id && section.type === "MCQ" && (
              <div className="mt-4 pt-4 border-t">
                <MCQQuestionForm
                  sectionId={section.id}
                  mode="edit"
                  questionId={q.id}
                  initialData={q}
                  onQuestionSaved={() => {
                    setEditingQuestionId(null);
                    fetchSection();
                  }}
                />
              </div>
            )}
          </div>
        ))}
          </>
        )}
      </div>
    )}

    {/* ================= FINAL SAVE ACTION ================= */}
    {section.questions.length > 0 && (
      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={() => {
            alert("Question Bank saved successfully!");
            router.push("/college/question-bank");
          }}
          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-sm font-medium"
        >
          Finish & Save Question Bank
        </button>
      </div>
    )}

    {/* ================= CANCEL CONFIRMATION MODAL ================= */}
    {showCancelModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">Wait! No Questions Added</h2>
            <p className="text-gray-600 mb-6 font-medium">
              You haven't added any questions to this Question Bank yet. Would you like to save it as an empty draft, or delete it completely?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={async () => {
                  try {
                    await api.delete(`/sections/${section.id}`);
                    router.push("/college/question-bank");
                  } catch (err: any) {
                    alert(err?.response?.data?.message || "Failed to delete");
                  }
                }}
                className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
              >
                Delete Question Bank
              </button>
              
              <button
                onClick={() => router.push("/college/question-bank")}
                className="px-4 py-2 border hover:bg-gray-50 rounded-lg transition"
              >
                Save as Draft
              </button>

              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}