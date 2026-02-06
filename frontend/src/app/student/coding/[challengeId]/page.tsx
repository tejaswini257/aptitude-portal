"use client";

import { useParams } from "next/navigation";
import styles from "../../student.module.css";

export default function CodingChallengePage() {
  const { challengeId } = useParams();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.sectionTitle}>
        Coding Challenge #{challengeId}
      </h1>

      <textarea
        className="w-full h-64 p-4 border rounded-md"
        placeholder="Write your solution here..."
      />

      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md">
        Submit Code
      </button>
    </div>
  );
}
