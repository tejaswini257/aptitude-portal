import Link from "next/link";

const topics = [
  "quantitative",
  "logical",
  "verbal",
];

export default function PracticePage() {
  return (
    <>
      <h2 style={{ fontSize: "24px", marginBottom: "30px" }}>
        Practice Topics
      </h2>

      <div style={{ display: "flex", gap: "20px" }}>
        {topics.map((topic) => (
          <Link key={topic} href={`/student/practice/${topic}`}>
            <div
              style={{
                padding: "20px",
                background: "#fff",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                minWidth: "180px",
              }}
            >
              {topic.toUpperCase()}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
