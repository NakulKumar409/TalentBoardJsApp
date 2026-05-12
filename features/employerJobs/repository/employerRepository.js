// features/employerJobs/repository/employerRepository.js
import apiClient from "../../../core/api/apiClient";

export const employerRepository = {
  getJobs: async () => {
    const result = await apiClient.get("/jobs", false);
    let jobsData = [];
    if (result.success) {
      if (Array.isArray(result.data)) jobsData = result.data;
      else if (result.data?.data && Array.isArray(result.data.data))
        jobsData = result.data.data;
    }
    return { success: result.success, data: jobsData, error: result.error };
  },

  getApplications: async () => {
    const result = await apiClient.get("/applications", true);
    let appsData = [];
    if (result.success) {
      if (Array.isArray(result.data)) appsData = result.data;
      else if (
        result.data?.applications &&
        Array.isArray(result.data.applications)
      )
        appsData = result.data.applications;
      else if (result.data?.data && Array.isArray(result.data.data))
        appsData = result.data.data;
    }
    return { success: result.success, data: appsData, error: result.error };
  },

  createJob: async (payload) => {
    return await apiClient.post("/jobs/create", payload, true);
  },

  updateJob: async (jobId, payload) => {
    return await apiClient.put(`/jobs/${jobId}`, payload, true);
  },

  deleteJob: async (jobId) => {
    return await apiClient.delete(`/jobs/${jobId}`, true);
  },

  updateApplicationStatus: async (appId, status) => {
    return await apiClient.put(`/applications/${appId}`, { status }, true);
  },
};
