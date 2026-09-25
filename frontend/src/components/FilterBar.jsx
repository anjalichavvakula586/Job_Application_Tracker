// function FilterBar({ filters, onChange, onReset, shown, total }) {
//     console.log("FILTER BAR IS RUNNING");
//   const isFiltering =
//     filters.search !== "" ||
//     filters.status !== "All" ||
//     filters.jobType !== "All";

//   return (
//     <div
//       style={{
//         display: "flex",
//         gap: "10px",
//         alignItems: "center",
//         marginTop: "20px",
//         padding: "10px",
//         border: "1px solid #ddd",
//         background: "#fff",
//       }}
//     >
//       <input
//         type="text"
//         placeholder="Search company or job role..."
//         value={filters.search}
//         onChange={(e) => onChange("search", e.target.value)}
//       />

//       <select
//         value={filters.status}
//         onChange={(e) => onChange("status", e.target.value)}
//       >
//         <option value="All">Status: All</option>
//         <option value="Saved">Saved</option>
//         <option value="Applied">Applied</option>
//         <option value="Interview">Interview</option>
//         <option value="Offer">Offer</option>
//         <option value="Rejected">Rejected</option>
//       </select>

//       <select
//         value={filters.jobType}
//         onChange={(e) => onChange("jobType", e.target.value)}
//       >
//         <option value="All">Job Type: All</option>
//         <option value="Full Time">Full Time</option>
//         <option value="Part Time">Part Time</option>
//         <option value="Internship">Internship</option>
//         <option value="Contract">Contract</option>
//       </select>

//       {isFiltering && (
//         <button type="button" onClick={onReset}>
//           Clear filters
//         </button>
//       )}

//       <span>
//         Showing {shown} of {total}
//       </span>
//     </div>
//   );
// }

// export default FilterBar;
import "./FilterBar.css";

const statusFilters = ["All", "Saved", "Applied", "Interview", "Offer", "Rejected"];
const typeFilters = ["All", "Full Time", "Part Time", "Internship", "Contract"];

function FilterBar({ filters, onChange, onReset, shown, total, sortBy, sortOrder, onSortChange }) {
  const isFiltering =
    filters.search !== "" ||
    filters.status !== "All" ||
    filters.jobType !== "All";

  return (
    <div className="filter-bar">
      <input
        className="filter-search"
        type="text"
        placeholder="Search company or job role..."
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)}
      />

      <select
        className="filter-select"
        value={filters.status}
        onChange={(e) => onChange("status", e.target.value)}
      >
        {statusFilters.map((s) => (
          <option key={s} value={s}>
            {s === "All" ? "Status: All" : s}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filters.jobType}
        onChange={(e) => onChange("jobType", e.target.value)}
      >
        {typeFilters.map((t) => (
          <option key={t} value={t}>
            {t === "All" ? "Job Type: All" : t}
          </option>
        ))}
      </select>
            <select
        className="filter-select"
        value={sortBy}
        onChange={(e) => onSortChange("sortBy", e.target.value)}
      >
        <option value="none">Sort: None</option>
        <option value="date">Sort by Date</option>
        <option value="salary">Sort by Salary</option>
      </select>

      {sortBy !== "none" && (
        <select
          className="filter-select"
          value={sortOrder}
          onChange={(e) => onSortChange("sortOrder", e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      )}

      {isFiltering && (
        <button type="button" className="filter-reset" onClick={onReset}>
          Clear filters
        </button>
      )}

      <span className="filter-count">
        Showing {shown} of {total}
      </span>
    </div>
  );
}

export default FilterBar;