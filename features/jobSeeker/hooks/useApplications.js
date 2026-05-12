// features/jobSeeker/hooks/useApplications.js
import { useState, useCallback } from "react";
import { applicationsRepository } from "../repository/applicationsRepository";

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    const result = await applicationsRepository.getMyApplications();
    if (result.success) setApplications(result.data);
    setLoading(false);
    return result;
  }, []);

  const submitApplication = useCallback(async (formData) => {
    return await applicationsRepository.submitApplication(formData);
  }, []);

  return { applications, loading, loadApplications, submitApplication };
};
