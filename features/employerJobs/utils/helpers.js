
// features/employerJobs/utils/helpers.js
export const getStatusColor = (s) => {
  const status = (s || "Applied").toLowerCase();
  const colors = {
    applied: "#F59E0B", pending: "#F59E0B", reviewed: "#3B82F6",
    shortlisted: "#10B981", rejected: "#EF4444", hired: "#8B5CF6",
  };
  return colors[status] || "#888";
};

export const getStatusLabel = (s) =>
  (s || "Applied").charAt(0).toUpperCase() + (s || "Applied").slice(1);

export const calculateStats = (jobs, applications) => {
  const safeApps = Array.isArray(applications) ? applications : [];
  return {
    totalJobs: jobs.length,
    applications: safeApps.length,
    pending: safeApps.filter(a => 
      a.status?.toLowerCase() === "applied" || a.status?.toLowerCase() === "pending"
    ).length,
    shortlisted: safeApps.filter(a => a.status?.toLowerCase() === "shortlisted").length,
    hired: safeApps.filter(a => a.status?.toLowerCase() === "hired").length,
  };
};

export const filterJobs = (jobs, search) => {
  return jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase())
  );
};

export const filterApplications = (applications, search, filter) => {
  return applications.filter(a => {
    const matchSearch = (a.fullName || a.name || "").toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || a.status?.toLowerCase() === filter.toLowerCase();
    return matchSearch && matchFilter;
  });
};

export const getJobTitle = (jobs, jobId) => {
  if (typeof jobId === "object" && jobId !== null) return jobId.title || "Unknown";
  const job = jobs.find(j => j._id === jobId);
  return job?.title || "Unknown Position";
};

export const resetFormData = () => ({
  title: "", profile: "", company: "", location: "", salary: "",
  type: "Full Time", skillsRequired: "", experienceRequired: "", description: "",
});