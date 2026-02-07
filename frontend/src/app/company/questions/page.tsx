"use client";

const questions = [
  { type: "Aptitude", title: "Time & Work Problem" },
  { type: "Coding", title: "Two Sum Problem" },
  { type: "Coding", title: "LRU Cache Implementation" },
];

export default function QuestionsPage() {
  return (
    <>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "30px" }}>
        Question Bank
      </h2>

      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        {questions.map((q, index) => (
          <div
            key={index}
            style={{
              padding: "16px 0",
              borderBottom:
                index !== questions.length - 1
                  ? "1px solid #e2e8f0"
                  : "none",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <strong>{q.title}</strong>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                {q.type}
              </div>
            </div>

            <button
              style={{
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
