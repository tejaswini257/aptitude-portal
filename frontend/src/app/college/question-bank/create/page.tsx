"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";
import Link from "next/link";

export default function CreateSectionPage() {
  const router = useRouter();

  const [sectionName, setSectionName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const maxDescriptionLength = 250;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    if (!sectionName.trim()) {
      setErrorMessage("Section name is required");
      return;
    }

    if (sectionName.length < 3) {
      setErrorMessage("Section name must be at least 3 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/sections", {
        sectionName,
        description: description || undefined,
        type: "MIXED",
        isQuestionBank: true,
      });

      const createdSection = res.data;

      router.push(`/college/question-bank/${createdSection.id}`);

    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Something went wrong";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link href="/college/question-bank" className="hover:underline">
          Question Bank
        </Link>{" "}
        / Create Section
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold">Create Question Bank Section</h1>
        <p className="text-gray-500 text-sm mt-1">
          Create a reusable section for MCQ, Coding, Passage Writing, Passage Dropdown, or Unseen Paragraph questions.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6 space-y-6 shadow-sm"
      >
        {/* Section Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Section Name
          </label>
          <input
            type="text"
            value={sectionName}
            onChange={(e) => {
              setSectionName(e.target.value);
              setErrorMessage("");
            }}
            placeholder="e.g. Quantitative Aptitude"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">
              {errorMessage}
            </p>
          )}
        </div>


        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= maxDescriptionLength) {
                setDescription(e.target.value);
              }
            }}
            placeholder="Brief description about this section..."
            className="w-full border rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {description.length} / {maxDescriptionLength}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-emerald-500 text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600"
          >
            {loading ? "Creating..." : "Create Section"}
          </button>
        </div>
      </form>
    </div>
  );
}
