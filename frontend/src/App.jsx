import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddJobModal from "./components/AddJobModal";
import FilterBar from "./components/FilterBar";
import Dashboard from "./pages/Dashboard";
import Board from "./pages/Board";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { getToken, clearToken, isLoggedIn } from "./utils/auth";
import "./App.css";
import "./components/JobDetailsModal.css";
import Analysis from "./pages/Analysis";
const defaultFilters = { search: "", status: "All", jobType: "All" };

function parseSalary(salary) {
  if (!salary || salary === "-") return 0;
  const num = parseFloat(String(salary).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

function parseAppliedDate(dateStr) {
  if (!dateStr || dateStr === "-") return 0;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function App() {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("none"); // "none" | "date" | "salary"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" | "desc"
  const [viewingJob, setViewingJob] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch("http://localhost:5000/api/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unauthorized");
        return response.json();
      })
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => {
  console.error("Failed to fetch jobs:", error);
  setJobs([]);
  setFetchError("Could not load your jobs. Please check your connection and try again.");
});
  }, []);

  function openAdd() {
    setEditingJob(null);
    setIsModalOpen(true);
  }

  function openEdit(job) {
    setEditingJob(job);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingJob(null);
  }

  async function saveJob(savedJob) {
    const token = getToken();

    if (editingJob) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/jobs/${editingJob._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(savedJob),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update job");
        }

        const updatedJob = await response.json();

        setJobs((prev) =>
          prev.map((job) => (job._id === updatedJob._id ? updatedJob : job))
        );

        closeModal();
      } catch (error) {
        console.error("Failed to update job:", error);
      }

      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(savedJob),
      });

      if (!response.ok) {
        throw new Error("Failed to save job");
      }

      const newJob = await response.json();

      setJobs((prev) => [newJob, ...prev]);
      closeModal();
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  }

  async function deleteJob(job) {
    const ok = window.confirm(
      `Delete "${job.position}" at ${job.company}? This cannot be undone.`
    );
    if (!ok) return;

    const token = getToken();

    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/${job._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs((prev) => prev.filter((j) => j._id !== job._id));
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  }

  async function updateJobStatus(jobId, newStatus) {
    const token = getToken();

    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedJob = await response.json();

      setJobs((prev) =>
        prev.map((job) => (job._id === updatedJob._id ? updatedJob : job))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  function updateFilter(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function updateSort(name, value) {
    if (name === "sortBy") {
      setSortBy(value);
    } else if (name === "sortOrder") {
      setSortOrder(value);
    }
  }

  function resetFilters() {
    setFilters(defaultFilters);
  }

  function openView(job) {
    setViewingJob(job);
  }

  function handleLogout() {
    clearToken();
    setJobs([]);
    navigate("/login");
  }

  // Search + status + job type all have to match
  const query = filters.search.trim().toLowerCase();
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !query ||
      job.company.toLowerCase().includes(query) ||
      job.position.toLowerCase().includes(query);

    const matchesStatus =
      filters.status === "All" ||
      job.status === filters.status ||
      (filters.status === "Interview" && job.status === "Phone Screen");

    // Older dummy jobs have no jobType, so treat them as Full Time
    const matchesType =
      filters.jobType === "All" ||
      (job.jobType || "Full Time") === filters.jobType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "none") return 0;

    let valueA, valueB;

    if (sortBy === "date") {
      valueA = parseAppliedDate(a.appliedDate);
      valueB = parseAppliedDate(b.appliedDate);
    } else if (sortBy === "salary") {
      valueA = parseSalary(a.salary);
      valueB = parseSalary(b.salary);
    }

    if (sortOrder === "asc") {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  const filterBar = (
    <FilterBar
      filters={filters}
      onChange={updateFilter}
      onReset={resetFilters}
      shown={filteredJobs.length}
      total={jobs.length}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={updateSort}
    />
  );

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              isLoggedIn() ? (
                <Dashboard
                  jobs={sortedJobs}
                  filterBar={filterBar}
                  onAddJob={openAdd}
                  onEdit={openEdit}
                  onDelete={deleteJob}
                  onView={openView}
                  onStatusChange={updateJobStatus}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/board"
            element={
              isLoggedIn() ? (
                <Board
                  jobs={sortedJobs}
                  filterBar={filterBar}
                  onAddJob={openAdd}
                  onEdit={openEdit}
                  onDelete={deleteJob}
                  onView={openView}
                  onStatusChange={updateJobStatus}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
  path="/analysis"
  element={
    isLoggedIn() ? (
      <Analysis jobs={jobs} />
    ) : (
      <Navigate to="/login" />
    )
  }
/>
        </Routes>
      </main>

      {viewingJob && (
        <div className="job-details-overlay">
          <div className="job-details-modal">
            <h2>{viewingJob.position}</h2>

            <p className="job-detail">
              <strong>Company:</strong> {viewingJob.company}
            </p>
            <p className="job-detail">
              <strong>Location:</strong> {viewingJob.location}
            </p>

            <p className="job-detail">
              <strong>Status:</strong> {viewingJob.status}
            </p>

            <p className="job-detail">
              <strong>Salary:</strong> {viewingJob.salary}
            </p>

            <p className="job-detail">
              <strong>Applied Date:</strong> {viewingJob.appliedDate}
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                className="job-details-close"
                onClick={() => {
                  setViewingJob(null);
                  openEdit(viewingJob);
                }}
              >
                Edit Job
              </button>

              <button
                className="job-details-close"
                onClick={() => setViewingJob(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <AddJobModal
          key={editingJob ? editingJob._id : "new"}
          job={editingJob}
          onSave={saveJob}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;