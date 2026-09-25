import { useState } from "react";
import "./AddJobModal.css";

const jobTypes = ["Full Time", "Part Time", "Internship", "Contract"];
const statuses = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

const emptyForm = {
  company: "",
  position: "",
  location: "",
  jobType: "Full Time",
  appliedDate: "",
  status: "Saved",
  salary: "",
  url: "",
  notes: "",
};

function formatDate(isoDate) {
  // "2025-05-02" -> "02 May 2025"
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function toISODate(text) {
  // "02 May 2025" -> "2025-05-02" (so the date input can show it)
  if (!text || text === "-") return "";
  const months = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };
  const [day, month, year] = text.split(" ");
  const mm = months[(month || "").slice(0, 3).toLowerCase()];
  if (!mm || !year) return "";
  return `${year}-${mm}-${day.padStart(2, "0")}`;
}

function formFromJob(job) {
  return {
    company: job.company || "",
    position: job.position || "",
    location: job.location || "",
    jobType: job.jobType || "Full Time",
    appliedDate: toISODate(job.appliedDate),
    status: job.status || "Saved",
    salary: job.salary === "-" ? "" : job.salary || "",
    url: job.url || "",
    notes: job.notes || "",
  };
}

function AddJobModal({ job, onSave, onClose }) {
  const isEdit = Boolean(job);
  const [form, setForm] = useState(isEdit ? formFromJob(job) : emptyForm);
  const [errors, setErrors] = useState({});

  // If an old job has a status like "Phone Screen", keep it in the dropdown
  const statusList = statuses.includes(form.status)
    ? statuses
    : [...statuses, form.status];

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (!form.company.trim()) newErrors.company = "Company name is required";
    if (!form.position.trim()) newErrors.position = "Job role is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (form.status !== "Saved" && !form.appliedDate) {
      newErrors.appliedDate = "Application date is required";
    }
    if (form.url.trim() && !/^https?:\/\//i.test(form.url.trim())) {
      newErrors.url = "URL must start with http:// or https://";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: isEdit ? job.id : Date.now(),
      company: form.company.trim(),
      position: form.position.trim(),
      location: form.location.trim(),
      jobType: form.jobType,
      status: form.status,
      salary: form.salary.trim() || "-",
      appliedDate: form.appliedDate ? formatDate(form.appliedDate) : "-",
      url: form.url.trim(),
      notes: form.notes.trim(),
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? "Edit Job" : "Add Job"}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-field">
              <label>Company Name *</label>
              <input name="company" value={form.company} onChange={handleChange} />
              {errors.company && <span className="form-error">{errors.company}</span>}
            </div>

            <div className="form-field">
              <label>Job Role *</label>
              <input name="position" value={form.position} onChange={handleChange} />
              {errors.position && <span className="form-error">{errors.position}</span>}
            </div>

            <div className="form-field">
              <label>Location *</label>
              <input name="location" value={form.location} onChange={handleChange} />
              {errors.location && <span className="form-error">{errors.location}</span>}
            </div>

            <div className="form-field">
              <label>Job Type</label>
              <select name="jobType" value={form.jobType} onChange={handleChange}>
                {jobTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Application Date {form.status !== "Saved" && "*"}</label>
              <input
                type="date"
                name="appliedDate"
                value={form.appliedDate}
                onChange={handleChange}
              />
              {errors.appliedDate && (
                <span className="form-error">{errors.appliedDate}</span>
              )}
            </div>

            <div className="form-field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {statusList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Salary</label>
              <input
                name="salary"
                placeholder="$45,000"
                value={form.salary}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Job URL</label>
              <input
                name="url"
                placeholder="https://..."
                value={form.url}
                onChange={handleChange}
              />
              {errors.url && <span className="form-error">{errors.url}</span>}
            </div>
          </div>

          <div className="form-field">
            <label>Notes</label>
            <textarea
              name="notes"
              rows="3"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-job-btn">
              {isEdit ? "Save Changes" : "Save Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddJobModal;