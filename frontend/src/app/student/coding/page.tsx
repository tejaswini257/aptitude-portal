import styles from "../student.module.css";
import CodingCard from "../components/CodingCard";

export default function CodingPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.sectionTitle}>Coding Challenges</h1>

      <div className={styles.grid3}>
        <CodingCard title="Two Sum Problem" difficulty="Easy" />
        <CodingCard title="Merge Intervals" difficulty="Medium" />
        <CodingCard title="LRU Cache" difficulty="Hard" />
      </div>
    </div>
  );
}
