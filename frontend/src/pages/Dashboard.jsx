
// import JobTable from "../components/JobTable";
// import { statsData } from "../data/jobsData";

// function Dashboard({ jobs, filterBar, onAddJob, onEdit, onDelete, onView, }) {


//     const totalApplications = jobs.length;

// const activeApplications = jobs.filter(
//   (job) =>
//     job.status !== "Rejected" &&
//     job.status !== "Offer"
// ).length;

// const interviews = jobs.filter(
//   (job) =>
//     job.status === "Interview" ||
//     job.status === "Phone Screen"
// ).length;

//   return (
//     <>
//       <div className="page-header">
//         <h1 className="page-title">Job Tracker</h1>
//         <button className="add-job-btn" onClick={onAddJob}>
//           + Add Job
//         </button>
//       </div>

//       <div className="stats-row">
//        <StatCard
//   label="Total Applications"
//   value={totalApplications}
//   change=""
// />

// <StatCard
//   label="Active Applications"
//   value={activeApplications}
//   change=""
// />

// <StatCard
//   label="Interviews"
//   value={interviews}
//   change=""
// />
//       </div>
     

//       {filterBar}

//       <JobTable jobs={jobs} onEdit={onEdit} onDelete={onDelete} onView={onView}/>
//     </>
//   );
// }

// export default Dashboard;
import StatCard from "../components/StatCard";
import JobTable from "../components/JobTable";

function Dashboard({
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
  const totalApplications = jobs.length;

  const activeApplications = jobs.filter(
    (job) =>
      job.status !== "Rejected" &&
      job.status !== "Offer"
  ).length;

  const interviews = jobs.filter(
    (job) =>
      job.status === "Interview" ||
      job.status === "Phone Screen"
  ).length;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Job Tracker</h1>

        <button className="add-job-btn" onClick={onAddJob}>
          + Add Job
        </button>
      </div>

      <div className="stats-row">
        <StatCard
          label="Total Applications"
          value={totalApplications}
          change=""
          index={0}
        />

        <StatCard
          label="Active Applications"
          value={activeApplications}
          change=""
          index={1}
        />

        <StatCard
          label="Interviews"
          value={interviews}
          change=""
          index={2}
        />
      </div>

      {filterBar}

      {fetchError && <div className="error-banner">{fetchError}</div>}
      {isLoading ? (
  <div className="loading-state">Loading your jobs...</div>
) : (
  <JobTable
    jobs={jobs}
    onEdit={onEdit}
    onDelete={onDelete}
    onView={onView}
    onStatusChange={onStatusChange}
  />
)}
    </>
  );
}

export default Dashboard;