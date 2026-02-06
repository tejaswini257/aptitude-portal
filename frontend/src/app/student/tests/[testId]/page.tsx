"use client";
import { useParams } from "next/navigation";

export default function TestAttemptPage() {
  const { testId } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Test Attempt - {testId}
      </h1>

      <p>Questions will load here...</p>
    </div>
  );
}
