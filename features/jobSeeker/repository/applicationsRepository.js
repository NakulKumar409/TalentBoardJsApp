// features/jobSeeker/repository/applicationsRepository.js
import apiClient from "../../../core/api/apiClient";

export const applicationsRepository = {
  getMyApplications: async () => {
    const result = await apiClient.get("/applications/my", true);
    let appsData = [];

    if (result.success) {
      // Your API returns { success: true, count: 1, applications: [...] }
      if (
        result.data?.applications &&
        Array.isArray(result.data.applications)
      ) {
        appsData = result.data.applications; // ✅ Ye sahi hai
      } else if (Array.isArray(result.data)) {
        appsData = result.data;
      }
    }

    return { success: result.success, data: appsData, error: result.error };
  },

  submitApplication: async (formData) => {
    return await apiClient.post("/applications/apply", formData, true, true);
  },
};
