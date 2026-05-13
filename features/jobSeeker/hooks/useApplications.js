// features/jobSeeker/hooks/useApplications.js
import { useState, useCallback } from "react";
import { applicationsRepository } from "../repository/applicationsRepository";

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user's applications
  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await applicationsRepository.getMyApplications();

      if (result.success) {
        setApplications(result.data || []);
        return { success: true, data: result.data };
      } else {
        setError(result.error || "Failed to load applications");
        setApplications([]);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setApplications([]);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit new application
  const submitApplication = useCallback(async (formData) => {
    try {
      setLoading(true);
      const result = await applicationsRepository.submitApplication(formData);
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh applications
  const refreshApplications = useCallback(async () => {
    return await loadApplications();
  }, [loadApplications]);

  // Clear applications (on logout)
  const clearApplications = useCallback(() => {
    setApplications([]);
    setError(null);
  }, []);

  return {
    applications,
    loading,
    error,
    loadApplications,
    submitApplication,
    refreshApplications,
    clearApplications,
  };
};
