import StatsCard from "../components/StatCard";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Tests Attempted" value="12" />
        <StatsCard title="Average Score" value="78%" />
        <StatsCard title="Active Drives" value="3" />
      </div>
    </div>
  );
}
