"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
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

const monthlyData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 78 },
  { month: "Apr", score: 82 },
  { month: "May", score: 88 },
];

const subjectData = [
  { name: "Quantitative", value: 40 },
  { name: "Logical", value: 35 },
  { name: "Verbal", value: 25 },
];

const COLORS = ["#4f46e5", "#7c3aed", "#06b6d4"];

export default function AnalyticsPage() {
  return (
    <>
      <h2 style={{ fontSize: "26px", marginBottom: "30px" }}>
        Performance Analytics
      </h2>

      <div style={{ display: "grid", gap: "30px" }}>
        {/* Line Chart */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: "20px" }}>Monthly Score Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4f46e5"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: "20px" }}>Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <Bar dataKey="score" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: "20px" }}>Skill Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {subjectData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
};
