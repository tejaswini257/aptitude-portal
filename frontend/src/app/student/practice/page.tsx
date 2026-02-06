"use client";

import styles from "../student.module.css";
import Link from "next/link";
import { Calculator, Brain, BookText } from "lucide-react";

const topics = [
  {
    title: "Quantitative Aptitude",
    desc: "Master numbers, percentages, ratios & problem solving.",
    slug: "quant",
    progress: 65,
    icon: Calculator,
  },
  {
    title: "Logical Reasoning",
    desc: "Improve analytical and pattern recognition skills.",
    slug: "reasoning",
    progress: 45,
    icon: Brain,
  },
  {
    title: "Verbal Ability",
    desc: "Enhance grammar, vocabulary & comprehension.",
    slug: "verbal",
    progress: 80,
    icon: BookText,
  },
];

export default function PracticePage() {
  return (
    <>
      <h2 className={styles.title}>Practice Modules</h2>

      <div className={styles.grid}>
        {topics.map((topic, index) => {
          const Icon = topic.icon;

          return (
            <Link
              key={index}
              href={`/student/practice/${topic.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div className={styles.topicCard}>
                <div className={styles.topicIcon}>
                  <Icon size={20} />
                </div>

                <div className={styles.cardTitle}>
                  {topic.title}
                </div>

                <div className={styles.cardSub}>
                  {topic.desc}
                </div>

                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  {topic.progress}% Completed
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
