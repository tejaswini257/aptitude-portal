import styles from "../student.module.css";
import Link from "next/link";

const challenges = [
  { title: "Two Sum Problem", difficulty: "Easy" },
  { title: "Merge Intervals", difficulty: "Medium" },
  { title: "LRU Cache", difficulty: "Hard" },
];

export default function CodingPage() {
  return (
    <>
      <h2 className={styles.title}>Coding Challenges</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {challenges.map((challenge, index) => (
          <div key={index} className={styles.challengeCard}>
            
            <div className={styles.challengeHeader}>
              <div className={styles.challengeTitle}>
                {challenge.title}
              </div>

              <div
                className={`${styles.badge} ${
                  challenge.difficulty === "Easy"
                    ? styles.easy
                    : challenge.difficulty === "Medium"
                    ? styles.medium
                    : styles.hard
                }`}
              >
                {challenge.difficulty}
              </div>
            </div>

            <div className={styles.challengeFooter}>
              <Link
                href="/student/coding/1"
                className={styles.primaryButton}
              >
                Solve Challenge →
              </Link>
            </div>

          </div>
        ))}
      </div>
    </>
  );
}
