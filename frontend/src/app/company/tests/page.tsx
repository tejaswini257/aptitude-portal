"use client";

const tests = [
  { name: "Aptitude Test - Round 1", questions: 30, duration: "60 mins" },
  { name: "Coding Round", questions: 3, duration: "90 mins" },
];

export default function TestsPage() {
  return (
    <>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "30px" }}>
        Test Modules
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "20px",
        }}
      >
        {tests.map((test, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 600 }}>
              {test.name}
            </h3>

            <p style={{ color: "#64748b", marginTop: "8px" }}>
              Questions: {test.questions}
            </p>

            <p style={{ color: "#64748b" }}>
              Duration: {test.duration}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
