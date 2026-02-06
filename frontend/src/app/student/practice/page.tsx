import Link from "next/link";
import styles from "../student.module.css";

const topics = [
  { name: "Quantitative Aptitude", slug: "quant" },
  { name: "Logical Reasoning", slug: "reasoning" },
  { name: "Verbal Ability", slug: "verbal" },
];

export default function PracticePage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.sectionTitle}>Practice Topics</h1>

      <div className={styles.grid3}>
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/student/practice/${topic.slug}`}
            className={styles.card}
          >
            <h2 className="text-lg font-semibold">{topic.name}</h2>
            <p className="text-gray-500 mt-2">
              Start practicing {topic.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
