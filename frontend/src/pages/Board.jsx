import "./Board.css";

const columns = [
  { title: "Saved", statuses: ["Saved"] },
  { title: "Applied", statuses: ["Applied"] },
  { title: "Interview", statuses: ["Phone Screen", "Interview"] },
  { title: "Offer", statuses: ["Offer"] },
  { title: "Rejected", statuses: ["Rejected"] },
];

function Board({
  jobs,
  filterBar,
  onAddJob,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  isLoading,
  fetchError
}) {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Kanban Board</h1>
        <button className="add-job-btn" onClick={onAddJob}>
          + Add Job
        </button>
      </div>

      {filterBar}

      {fetchError && <div className="error-banner">{fetchError}</div>}

      {isLoading ? (
        <div className="loading-state">Loading your board...</div>
      ) : (
        <div className="board">
          {columns.map((column) => {
            const columnJobs = jobs.filter((job) =>
              column.statuses.includes(job.status)
            );

            return (
              <div className="board-column" key={column.title}>
                <div className="board-column-header">
                  <span>{column.title}</span>
                  <span className="board-count">{columnJobs.length}</span>
                </div>

                {columnJobs.length === 0 && (
  <div className="board-empty">
    <div className="board-empty-icon">📭</div>
    No jobs yet
  </div>
)}

                {columnJobs.map((job) => (
                  <div className="board-card" key={job._id}>
                    <div
                      className="board-card-role"
                      onClick={() => onView(job)}
                      style={{ cursor: "pointer" }}
                    >
                      {job.position}
                    </div>
                    <div className="board-card-company">{job.company}</div>
                    <div className="board-card-meta">📍 {job.location}</div>
                    <div className="board-card-meta">📅 {job.appliedDate}</div>

                    <select
                      value={job.status}
                      onChange={(e) => onStatusChange(job._id, e.target.value)}
                      className={
                        "status-select status-select-" +
                        job.status.toLowerCase().replace(" ", "-")
                      }
                    >
                      {[
                        "Saved",
                        "Applied",
                        "Phone Screen",
                        "Interview",
                        "Offer",
                        "Rejected",
                      ].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <div className="row-actions board-card-actions">
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
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Board;