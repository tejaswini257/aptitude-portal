"use client";

export default function CompanyAnalytics() {
  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Company Analytics</h2>
          <p className="page-subtitle">Visualize conversion from applications to final hires.</p>
        </div>
      </div>

      <div className="dashboard-grid-3">
        <StatCard title="Applications" value="180" />
        <StatCard title="Shortlisted" value="62" />
        <StatCard title="Selected" value="15" />
      </div>

      <div className="card">
        <h3 className="mb-6 font-semibold">Hiring Funnel</h3>

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
      <div className="dashboard-card-title">{title}</div>
      <div className="dashboard-card-value">{value}</div>
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
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
