"use client";

import Link from "next/link";

export default function CompanyTestsPage() {
  const tests = [
    {
      id: "aptitude-round-1",
      title: "Aptitude Test - Round 1",
      questions: 30,
      duration: 60,
    },
    {
      id: "coding-round",
      title: "Coding Round",
      questions: 3,
      duration: 90,
    },
  ];

  return (
    <>
      <h2
        style={{
          fontSize: "26px",
          fontWeight: 600,
          marginBottom: "30px",
        }}
      >
        Test Modules
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
          gap: "30px",
        }}
      >
        {tests.map((test) => (
          <Link
            key={test.id}
            href={`/company/tests/${test.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#ffffff",
                padding: "30px",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform =
                  "translateY(-6px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform =
                  "translateY(0px)")
              }
            >
              <h3 style={{ marginBottom: "16px" }}>
                {test.title}
              </h3>

              <p>Questions: {test.questions}</p>
              <p>Duration: {test.duration} mins</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
