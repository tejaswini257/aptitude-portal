"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/interceptors/axios";

type PracticeSet = {
  id: string;
  name: string;
  sectionTimer: number;
};

export default function PracticePage() {
  const [sets, setSets] = useState<PracticeSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/practice-sets/student")
      .then((res) => setSets(res.data || []))
      .catch(() => setSets([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Practice Sets</h2>
      {sets.length === 0 ? (
        <p className="text-gray-500">No practice sets available.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((ps) => (
            <Link key={ps.id} href={`/student/practice/set/${ps.id}`}>
              <div className="bg-white p-6 rounded-xl border hover:border-emerald-400 transition cursor-pointer">
                <h3 className="font-semibold text-gray-900">{ps.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {ps.sectionTimer} min timer
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
