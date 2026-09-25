import "./StatCard.css";

const colors = ["#6c63ff", "#1677c8", "#1f8f3f"];

function StatCard({ label, value, change, index = 0 }) {
  const color = colors[index % colors.length];

  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value-row">
        <span className="stat-value">{value}</span>
        <span className="stat-change">{change}</span>
      </div>
    </div>
  );
}

export default StatCard;