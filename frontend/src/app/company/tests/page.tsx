export default function TestsPage() {
  const tests = [
    { id: 1, name: "Aptitude Test 1", questions: 30 },
    { id: 2, name: "Coding Assessment", questions: 10 },
  ];

  return (
    <>
      <h1 style={{ marginBottom: "24px" }}>Tests</h1>

      {tests.map((t) => (
        <div key={t.id} style={{ background: "white", padding: "20px", borderRadius: "14px", marginBottom: "16px" }}>
          <h3>{t.name}</h3>
          <p style={{ color: "#6b7280" }}>
            {t.questions} Questions
          </p>
        </div>
      ))}
    </>
  );
}
