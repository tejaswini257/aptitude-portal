import styles from "../student.module.css";

export default function PracticeCard({
  title,
  questions,
}: {
  title: string;
  questions: number;
}) {
  return (
    <div className={styles.card}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-500 mt-2">{questions} Questions</p>

      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
        Start Practice
      </button>
    </div>
  );
}
