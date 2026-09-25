import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import "./Analysis.css";

const STATUS_ORDER = ["Saved", "Applied", "Phone Screen", "Interview", "Offer", "Rejected"];

const STATUS_COLORS = {
  Saved: "#999999",
  Applied: "#6c63ff",
  "Phone Screen": "#f5a623",
  Interview: "#1677c8",
  Offer: "#1f8f3f",
  Rejected: "#c53030",
};

function parseAppliedDate(dateStr) {
  if (!dateStr || dateStr === "-") return null;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function Analysis({ jobs }) {
  const total = jobs.length;
  const interviews = jobs.filter(
    (job) => job.status === "Interview" || job.status === "Phone Screen"
  ).length;
  const offers = jobs.filter((job) => job.status === "Offer").length;
  const rejected = jobs.filter((job) => job.status === "Rejected").length;

  const responseRate =
    total === 0
      ? 0
      : Math.round(((interviews + offers + rejected) / total) * 100);

  // Applications by Status (Bar)
  const statusData = STATUS_ORDER.map((status) => ({
    status,
    count: jobs.filter((job) => job.status === status).length,
  })).filter((item) => item.count > 0);

  // Status Distribution (Pie)
  const pieData = statusData.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  // Applications Over Time (Line) — grouped by month
  const monthCounts = {};
  jobs.forEach((job) => {
    const date = parseAppliedDate(job.appliedDate);
    if (!date) return;
    const key = date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });

  const timeData = Object.entries(monthCounts)
    .map(([month, count]) => ({
      month,
      count,
      sortKey: new Date(month).getTime(),
    }))
    .sort((a, b) => a.sortKey - b.sortKey);

  // Applications by Job Type (Bar)
  const jobTypeCounts = {};
  jobs.forEach((job) => {
    const type = job.jobType || "Full Time";
    jobTypeCounts[type] = (jobTypeCounts[type] || 0) + 1;
  });
  const jobTypeData = Object.entries(jobTypeCounts).map(([jobType, count]) => ({
    jobType,
    count,
  }));

  // Applications by Company (Bar) — top 8 companies
  const companyCounts = {};
  jobs.forEach((job) => {
    const company = job.company || "Unknown";
    companyCounts[company] = (companyCounts[company] || 0) + 1;
  });
  const companyData = Object.entries(companyCounts)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Analysis</h1>
      </div>

      <div className="analysis-summary-row">
        <div className="analysis-card">
          <div className="analysis-card-label">Total Applications</div>
          <div className="analysis-card-value">{total}</div>
        </div>

        <div className="analysis-card">
          <div className="analysis-card-label">Interviews</div>
          <div className="analysis-card-value">{interviews}</div>
        </div>

        <div className="analysis-card">
          <div className="analysis-card-label">Offers</div>
          <div className="analysis-card-value">{offers}</div>
        </div>

        <div className="analysis-card">
          <div className="analysis-card-label">Rejected</div>
          <div className="analysis-card-value">{rejected}</div>
        </div>

        <div className="analysis-card">
          <div className="analysis-card-label">Response Rate</div>
          <div className="analysis-card-value">{responseRate}%</div>
        </div>
      </div>

      {total === 0 ? (
        <div className="analysis-empty">
          Add some jobs to see your application analytics here.
        </div>
      ) : (
        <>
          <div className="charts-grid">
            <div className="chart-section">
              <div className="chart-section-title">Applications by Status</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6c63ff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <div className="chart-section-title">Status Distribution</div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[entry.name] || "#ccc"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <div className="chart-section-title">Applications by Job Type</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={jobTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="jobType" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1677c8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <div className="chart-section-title">Applications by Company</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={companyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="company"
                    tick={{ fontSize: 12 }}
                    width={90}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1f8f3f" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {timeData.length > 0 && (
            <div className="chart-section" style={{ marginTop: "20px" }}>
              <div className="chart-section-title">Applications Over Time</div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6c63ff"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Analysis;