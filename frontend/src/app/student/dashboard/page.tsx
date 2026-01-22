import StatCard from "../components/StatCard";
import styles from "../student.module.css";

export default function StudentDashboard() {
  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h2>Welcome back 👋</h2>
        <p>Here’s your learning progress</p>
      </div>

      {/* Stats Section */}
      <section>
        <div className={styles.statsGrid}>
          <StatCard label="Tests Attempted" value={12} />
          <StatCard label="Accuracy" value="78%" />
          <StatCard label="Coding Problems" value={34} />
          <StatCard label="Rank" value={124} />
        </div>
      </section>

      {/* Actions Section */}
      <section>
        <h3 className={styles.sectionTitle}>Quick Actions</h3>

        <div className={styles.actionsGrid}>
          <a href="/student/practice" className={styles.actionCard}>
            📘 Practice Tests
          </a>
          <a href="/student/coding" className={styles.actionCard}>
            💻 Coding Practice
          </a>
          <a href="/student/mocks" className={styles.actionCard}>
            📝 Mock Tests
          </a>
        </div>
      </section>
    </div>
  );
}
