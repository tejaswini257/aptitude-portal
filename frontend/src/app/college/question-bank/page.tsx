"use client";

import { useState } from "react";
import Link from "next/link";

export default function QuestionBankPage() {
  const [search, setSearch] = useState("");

  // Temporary mock data
  const sections = [
    { id: "1", name: "Quantitative Aptitude", questionCount: 25 },
    { id: "2", name: "Logical Reasoning", questionCount: 18 },
    { id: "3", name: "Verbal Ability", questionCount: 30 },
  ];

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Question Bank</h1>
          <p className="text-gray-500 text-sm">
            Manage reusable sections and their questions
          </p>
        </div>

        <Link
          href="/college/question-bank/create"
          className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
        >
          + Create Section
        </Link>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search sections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Section Grid */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No sections found.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="border rounded-xl p-5 hover:shadow-md transition bg-white"
            >
              <h2 className="text-lg font-medium mb-2">{section.name}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {section.questionCount} Questions
              </p>

              <div className="flex justify-between items-center">
                <Link
                  href={`/college/question-bank/${section.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Manage Questions →
                </Link>

                <button className="text-sm text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
