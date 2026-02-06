import styles from "../student.module.css";

export default function AnalyticsPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.sectionTitle}>Performance Analytics</h1>

      <div className={styles.grid3}>
        <div className={styles.card}>
          <h3>Total Tests Attempted</h3>
          <p className="text-2xl font-bold mt-2">14</p>
        </div>

        <div className={styles.card}>
          <h3>Average Score</h3>
          <p className="text-2xl font-bold mt-2">82%</p>
        </div>

        <div className={styles.card}>
          <h3>Best Performance</h3>
          <p className="text-2xl font-bold mt-2">Logical Reasoning</p>
        </div>
      </div>
    </div>
  );
}
