// Dummy/static job data - later this will come from the backend/database
export const statsData = [
  { label: "Total Applications", value: 86, change: "+12%" },
  { label: "Active Applications", value: 64, change: "+8%" },
  { label: "Interviews", value: 18, change: "+15%" },
];

export const jobsData = [
  {
    id: 1,
    position: "Senior Product Designer",
    company: "HubSpot",
    location: "Remote",
    status: "Applied",
    salary: "$45,000",
    appliedDate: "02 May 2025",
  },
  {
    id: 2,
    position: "Product Designer",
    company: "NASA",
    location: "Houston, USA",
    status: "Phone Screen",
    salary: "$45,000",
    appliedDate: "02 May 2025",
  },
  {
    id: 3,
    position: "Middle Designer",
    company: "Apple",
    location: "Cupertino, USA",
    status: "Applied",
    salary: "$45,000",
    appliedDate: "02 May 2025",
  },
  {
    id: 4,
    position: "UX/UI Designer",
    company: "BMW",
    location: "Munich, Germany",
    status: "Interview",
    salary: "$10,000",
    appliedDate: "02 May 2025",
  },
  {
    id: 5,
    position: "Senior Product Designer",
    company: "Google",
    location: "London, UK",
    status: "Phone Screen",
    salary: "$45,000",
    appliedDate: "02 May 2025",
  },
  {
    id: 6,
    position: "Visual Designer",
    company: "Spotify",
    location: "Stockholm, Sweden",
    status: "Saved",
    salary: "$40,000",
    appliedDate: "-",
  },
];

// The possible status options (used for the dropdown)
export const statusOptions = [
  "Saved",
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
];