import Link from "next/link";

const codingQuestions = [
  { id: "two-sum", difficulty: "Easy" },
  { id: "merge-intervals", difficulty: "Medium" },
  { id: "lru-cache", difficulty: "Hard" },
];

export default function CodingPage() {
  return (
    <>
      <h2 style={{ fontSize: "26px", marginBottom: "30px" }}>
        Coding Challenges
      </h2>

      {codingQuestions.map((q) => (
        <Link key={q.id} href={`/student/coding/${q.id}`}>
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "14px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              marginBottom: "20px",
              cursor: "pointer",
            }}
          >
            <h3>{q.id.replace("-", " ").toUpperCase()}</h3>
            <p style={{ color: "#6b7280" }}>
              Difficulty: {q.difficulty}
            </p>
          </div>
        </Link>
      ))}
    </>
  );
}
