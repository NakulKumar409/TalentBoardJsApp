// features/jobSeeker/repository/jobsRepository.js
import apiClient from "../../../core/api/apiClient";

export const jobsRepository = {
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
};
