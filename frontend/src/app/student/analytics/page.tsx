"use client";

import styles from "../student.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const progressData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 78 },
  { month: "Apr", score: 82 },
  { month: "May", score: 88 },
];

const sectionData = [
  { name: "Quant", score: 85 },
  { name: "Reasoning", score: 78 },
  { name: "Verbal", score: 72 },
];

const difficultyData = [
  { name: "Easy", value: 40 },
  { name: "Medium", value: 35 },
  { name: "Hard", value: 25 },
];

const COLORS = ["#16a34a", "#f59e0b", "#dc2626"];

export default function AnalyticsPage() {
  return (
    <>
      <h2 className={styles.title}>Performance Analytics</h2>

      {/* KPI CARDS */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div>Total Tests</div>
          <div className={styles.kpiValue}>14</div>
        </div>

        <div className={styles.kpiCard}>
          <div>Average Score</div>
          <div className={styles.kpiValue}>82%</div>
        </div>

        <div className={styles.kpiCard}>
          <div>Best Section</div>
          <div className={styles.kpiValue}>Quant</div>
        </div>

        <div className={styles.kpiCard}>
          <div>Accuracy</div>
          <div className={styles.kpiValue}>87%</div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className={styles.analyticsGrid}>

        {/* LINE CHART */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            Monthly Score Progress
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            Difficulty Distribution
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR CHART */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>
          Section-wise Performance
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sectionData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
