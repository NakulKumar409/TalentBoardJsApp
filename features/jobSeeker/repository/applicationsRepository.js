// features/jobSeeker/repository/applicationsRepository.js
import apiClient from "../../../core/api/apiClient";

export const applicationsRepository = {
  getMyApplications: async () => {
    const result = await apiClient.get("/applications/my", true);
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

  submitApplication: async (formData) => {
    return await apiClient.post("/applications/apply", formData, true, true);
  },
};
