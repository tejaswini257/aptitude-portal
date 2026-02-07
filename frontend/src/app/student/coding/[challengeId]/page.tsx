"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

/* ===============================
   MOCK DATA (Replace with API later)
================================= */

type Challenge = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  timeLimit: number; // minutes
};

const challengeData: Challenge[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    timeLimit: 20,
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    description:
      "Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals.",
    timeLimit: 30,
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "Hard",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    timeLimit: 40,
  },
];

/* ===============================
   COMPONENT
================================= */

export default function ChallengePage() {
  const { challengeId } = useParams();
  const challenge = challengeData.find(
    (c) => c.id === challengeId
  );

  const [code, setCode] = useState<string>("// Write your solution here");
  const [timeLeft, setTimeLeft] = useState<number>(
    challenge?.timeLimit ? challenge.timeLimit * 60 : 0
  );
  const [submitted, setSubmitted] = useState<boolean>(false);

  /* ===============================
     TIMER LOGIC
  ================================= */

  useEffect(() => {
    if (!challenge) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [challenge]);

  if (!challenge) {
    return <p>Challenge not found.</p>;
  }

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSubmit = () => {
    setSubmitted(true);

    // Later: call backend API here
    // POST /submissions
  };

  const difficultyColor = () => {
    if (challenge.difficulty === "Easy") return "#16a34a";
    if (challenge.difficulty === "Medium") return "#d97706";
    return "#dc2626";
  };

  return (
    <>
      {/* ===============================
          HEADER SECTION
      ================================= */}

      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: 600,
            marginBottom: "10px",
          }}
        >
          {challenge.title}
        </h2>

        <span
          style={{
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            background: "#f3f4f6",
            color: difficultyColor(),
            fontWeight: 500,
          }}
        >
          {challenge.difficulty}
        </span>

        <div
          style={{
            marginTop: "10px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          Time Remaining:{" "}
          <strong style={{ color: "#111827" }}>
            {formatTime()}
          </strong>
        </div>
      </div>

      {/* ===============================
          PROBLEM DESCRIPTION
      ================================= */}

      <div
        style={{
          background: "#ffffff",
          padding: "24px",
          borderRadius: "14px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          marginBottom: "20px",
        }}
      >
        <p style={{ lineHeight: "1.6" }}>
          {challenge.description}
        </p>
      </div>

      {/* ===============================
          CODE EDITOR
      ================================= */}

      <div
        style={{
          background: "#111827",
          padding: "20px",
          borderRadius: "14px",
          marginBottom: "20px",
        }}
      >
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: "100%",
            height: "300px",
            background: "transparent",
            color: "#f9fafb",
            border: "none",
            outline: "none",
            fontFamily: "monospace",
            fontSize: "14px",
            resize: "none",
          }}
        />
      </div>

      {/* ===============================
          ACTION BUTTONS
      ================================= */}

      <div style={{ display: "flex", gap: "16px" }}>
        <button
          style={buttonStyle}
          onClick={() => alert("Mock Run Executed")}
        >
          Run Code
        </button>

        <button style={buttonStyle} onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* ===============================
          SUBMISSION FEEDBACK
      ================================= */}

      {submitted && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            background: "#dcfce7",
            borderRadius: "10px",
            color: "#166534",
            fontWeight: 500,
          }}
        >
          ✅ Code submitted successfully!
        </div>
      )}
    </>
  );
}

/* ===============================
   BUTTON STYLE
================================= */

const buttonStyle: React.CSSProperties = {
  padding: "12px 20px",
  background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
  border: "none",
  color: "#fff",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 500,
};
