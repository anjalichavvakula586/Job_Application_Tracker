import { statusOptions } from "../data/jobsData";
import "./JobTable.css";

function JobTable({ jobs, onEdit, onDelete, onView, onStatusChange }) {
  return (
    <div className="job-table-wrapper">
      <table className="job-table">
        <thead>
          <tr>
            <th>Position & Company</th>
            <th>Status</th>
            <th>Salary</th>
            <th>Applied Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 && (
  <tr>
    <td colSpan="5">
      <div className="table-empty-state">
        <div className="search-icon-css"></div>
        <div className="table-empty-title">No jobs found</div>
        <div className="table-empty-text">
          Try adjusting your search or filters, or add a new job to get started.
        </div>
      </div>
    </td>
  </tr>
)}

          {jobs.map((job) => (
            <tr key={job._id}>
              <td>
                <div
                  className="job-position"
                  onClick={() => onView(job)}
                  style={{ cursor: "pointer" }}
                >
                  {job.position}
                </div>
                <div className="job-company">{job.company}</div>
              </td>
              <td>
                <select
                  value={job.status}
                  onChange={(e) => onStatusChange(job._id, e.target.value)}
                  className={
                    "status-select status-select-" +
                    job.status.toLowerCase().replace(" ", "-")
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td>{job.salary}</td>
              <td>{job.appliedDate}</td>
              <td>
                <div className="row-actions">
                  <button className="action-btn" onClick={() => onEdit(job)}>
                    Edit
                  </button>
                  <button
                    className="action-btn action-delete"
                    onClick={() => onDelete(job)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobTable;