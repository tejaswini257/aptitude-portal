"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";
import { useParams } from "next/navigation";

export default function SingleTestPage() {
  const { tests } = useParams();
  const [test, setTest] = useState<any>(null);

  useEffect(() => {
    if (!tests) return;

    const fetchTest = async () => {
      try {
        const res = await api.get(`/company/tests/${tests}`);
        setTest(res.data);
      } catch (err) {
        console.error("Single test error:", err);
      }
    };

    fetchTest();
  }, [tests]);

  if (!test) return <p>Loading test...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{test.name}</h1>

      <p>
        Proctoring: {test.proctoringEnabled ? "Enabled" : "Disabled"}
      </p>

      <p>
        Result Mode:{" "}
        {test.showResultImmediately
          ? "Immediate"
          : "After Evaluation"}
      </p>
    </div>
  );
}
