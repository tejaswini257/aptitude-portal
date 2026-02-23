"use client";

const questions = [
  { type: "Aptitude", title: "Time & Work Problem" },
  { type: "Coding", title: "Two Sum Problem" },
  { type: "Coding", title: "LRU Cache Implementation" },
];

export default function QuestionsPage() {
  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Question Bank</h2>
          <p className="page-subtitle">Manage aptitude and coding questions used in company tests.</p>
        </div>
      </div>

      <div className="card">
        {questions.map((q, index) => (
          <div key={index} className="list-item">
            <div>
              <div className="list-item-title">{q.title}</div>
              <div className="list-item-subtitle">{q.type}</div>
            </div>

            <button className="btn-primary">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
