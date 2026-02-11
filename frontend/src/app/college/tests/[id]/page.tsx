"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type SubmissionItem = {
  id: string;
  studentEmail: string;
  rollNo: string;
  department: string;
  score: number | null;
  submittedAt: string;
};

export default function CollegeTestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [test, setTest] = useState<{ name: string } | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [testRes, subRes] = await Promise.all([
          api.get(`/tests/${id}`),
          api.get(`/tests/${id}/submissions`),
        ]);
        setTest(testRes.data);
        setSubmissions(subRes.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error}
        <Link href="/college/tests" className="block mt-2 text-emerald-600">
          ← Back to Tests
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/college/tests"
        className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block"
      >
        ← Back to Tests
      </Link>

      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        {test?.name ?? "Test"}
      </h1>
      <p className="text-gray-500 mb-6">
        {submissions.length} student(s) attempted this test
      </p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-4">Email</th>
              <th className="p-4">Roll No</th>
              <th className="p-4">Department</th>
              <th className="p-4">Score</th>
              <th className="p-4">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No submissions yet.
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{s.studentEmail}</td>
                  <td className="p-4">{s.rollNo}</td>
                  <td className="p-4">{s.department}</td>
                  <td className="p-4 font-medium">{s.score ?? "—"}</td>
                  <td className="p-4">
                    {new Date(s.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
