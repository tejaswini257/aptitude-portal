import Link from "next/link";
import styles from "../student.module.css";

export default function CodingCard({
  title,
  difficulty,
}: {
  title: string;
  difficulty: string;
}) {
  return (
    <div className={styles.card}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-500 mt-2">
        Difficulty: {difficulty}
      </p>

      <Link
        href="/student/coding/1"
        className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Solve Challenge
      </Link>
    </div>
  );
}
