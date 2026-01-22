import StatCard from "@/app/student/components/StatCard";
import styles from "../student.module.css";

export default function StudentDashboard() {
  return (
    <div>
      {/* Header */}
      <h2>Welcome back 👋</h2>
      <p>Here’s your learning progress</p>

      {/* Stats */}
      <div className="statsGrid">
        <StatCard label="Tests Attempted" value={12} />
        <StatCard label="Accuracy" value="78%" />
        <StatCard label="Coding Problems" value={34} />
        <StatCard label="Rank" value={124} />
      </div>

      {/* Quick Actions */}
      <div className="actionsGrid">
        <a href="/student/practice" className="actionCard">
          📘 Practice Tests
        </a>

        <a href="/student/coding" className="actionCard">
          💻 Coding Practice
        </a>

        <a href="/student/mocks" className="actionCard">
          📝 Mock Tests
        </a>
      </div>
    </div>
  );
}
