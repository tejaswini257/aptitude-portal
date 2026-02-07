export default function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <p style={{ fontSize: "14px", color: "#64748b" }}>{title}</p>
      <h3 style={{ fontSize: "22px", marginTop: "8px" }}>{value}</h3>
    </div>
  );
}
