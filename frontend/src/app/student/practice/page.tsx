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
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Practice Sets</h2>
          <p className="page-subtitle">Hone your skills with these practice exercises.</p>
        </div>
      </div>

      {sets.length === 0 ? (
        <div className="card text-center p-12">
          <p className="text-secondary text-lg">No practice sets available.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((ps) => (
            <Link key={ps.id} href={`/student/practice/set/${ps.id}`} className="card hover:border-primary transition cursor-pointer flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-primary mb-2">{ps.name}</h3>
                <p className="text-secondary mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {ps.sectionTimer} min timer
                </p>
              </div>
              <button className="btn btn-outline w-full justify-center">Start Practice</button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
