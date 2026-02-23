"use client";

import { useState } from "react";
import { Plus, Edit2, Code2, BrainCircuit, Search, X } from "lucide-react";

const initialQuestions = [
  { id: 1, type: "Aptitude", title: "Time & Work Problem", difficulty: "Medium", usages: 12 },
  { id: 2, type: "Coding", title: "Two Sum Problem", difficulty: "Easy", usages: 45 },
  { id: 3, type: "Coding", title: "LRU Cache Implementation", difficulty: "Hard", usages: 8 },
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All Types" || q.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    setQuestions(questions.map(q => q.id === editingQuestion.id ? editingQuestion : q));
    setEditingQuestion(null);
  };

  return (
    <div className="page space-y-6 pb-8">
      <div className="page-header">
        <div>
          <h2 className="page-title">Question Bank</h2>
          <p className="page-subtitle">Manage aptitude and coding questions used in company tests.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} className="mr-2" />
          Add Question
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-default bg-surface-muted flex sm:flex-row flex-col gap-4 justify-between items-center text-sm">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search questions by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-default rounded-md text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-surface border border-default rounded-md text-primary outline-none"
            >
              <option value="All Types">All Types</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Coding">Coding</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {filteredQuestions.map((q) => (
            <div key={q.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
              <div className="flex items-start gap-4">
                <div className={`mt-1 p-2 rounded-lg ${q.type === 'Coding' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                  {q.type === 'Coding' ? <Code2 size={20} /> : <BrainCircuit size={20} />}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-primary mb-1 group-hover:text-blue-600 transition-colors">
                    {q.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-secondary">
                    <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-xs">{q.type}</span>
                    <span className="flex items-center gap-1">
                      Difficulty:
                      <span className={`font-medium ${q.difficulty === 'Hard' ? 'text-red-600' :
                        q.difficulty === 'Medium' ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                        {q.difficulty}
                      </span>
                    </span>
                    <span>•</span>
                    <span>Used in {q.usages} tests</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditingQuestion(q)}
                className="btn btn-secondary opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 size={16} className="mr-1.5" />
                Edit
              </button>
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="p-8 text-center text-secondary">
              No questions found matching your filters.
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-default">
              <h3 className="text-lg font-bold text-primary">Edit Question</h3>
              <button onClick={() => setEditingQuestion(null)} className="text-secondary hover:text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Title</label>
                <input
                  type="text"
                  value={editingQuestion.title}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-default rounded-md text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Type</label>
                  <select
                    value={editingQuestion.type}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, type: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-default rounded-md text-primary outline-none"
                  >
                    <option value="Aptitude">Aptitude</option>
                    <option value="Coding">Coding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Difficulty</label>
                  <select
                    value={editingQuestion.difficulty}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-default rounded-md text-primary outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-default mt-6">
                <button type="button" onClick={() => setEditingQuestion(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
