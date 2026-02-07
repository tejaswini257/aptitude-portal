export default function QuestionsPage() {
  const questions = [
    { id: 1, type: "MCQ", difficulty: "Easy" },
    { id: 2, type: "Coding", difficulty: "Medium" },
  ];

  return (
    <>
      <h1 style={{ marginBottom: "24px" }}>Question Bank</h1>

      {questions.map((q) => (
        <div key={q.id} style={{ background: "white", padding: "20px", borderRadius: "14px", marginBottom: "16px" }}>
          <p>Type: {q.type}</p>
          <p>Difficulty: {q.difficulty}</p>
        </div>
      ))}
    </>
  );
}
