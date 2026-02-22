"use client";

export default function CompanyAnalytics() {
  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Company Analytics</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Applications" value="180" />
        <StatCard title="Shortlisted" value="62" />
        <StatCard title="Selected" value="15" />
      </div>

      <div className="card mt-10">
        <h3 className="text-lg font-semibold mb-6">Hiring Funnel</h3>

        <Progress label="Applied" percent={100} />
        <Progress label="Shortlisted" percent={60} />
        <Progress label="Interviewed" percent={35} />
        <Progress label="Selected" percent={15} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="dashboard-card">
      <p className="dashboard-card-title">{title}</p>
      <h3 className="dashboard-card-value">{value}</h3>
    </div>
  );
}

function Progress({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="progress-container">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}