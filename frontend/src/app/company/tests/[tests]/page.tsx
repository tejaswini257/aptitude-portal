"use client";

import { useParams } from "next/navigation";

export default function TestDetailPage() {
  const { testId } = useParams();

  return (
    <>
      <h2 style={{ fontSize: "26px", marginBottom: "20px" }}>
        Test Details
      </h2>

      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        <p>
          You are viewing test:{" "}
          <strong>{testId}</strong>
        </p>

        <p style={{ marginTop: "10px" }}>
          Here recruiter can:
        </p>

        <ul style={{ marginTop: "10px" }}>
          <li>Edit Test</li>
          <li>Add Questions</li>
          <li>View Results</li>
          <li>Assign to Drive</li>
        </ul>
      </div>
    </>
  );
}
