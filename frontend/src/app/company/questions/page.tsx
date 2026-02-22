"use client";

const questions = [
  { type: "Aptitude", title: "Time & Work Problem" },
  { type: "Coding", title: "Two Sum Problem" },
  { type: "Coding", title: "LRU Cache Implementation" },
];

export default function QuestionsPage() {
  return (
    <div>
      <h2 className="page-title mb-6">Question Bank</h2>

      <div className="card">
        {questions.map((q, index) => (
          <div key={index} className="list-item">
            <div>
              <p className="list-item-title">{q.title}</p>
              <p className="list-item-subtitle">{q.type}</p>
            </div>

            <button className="btn-primary">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}