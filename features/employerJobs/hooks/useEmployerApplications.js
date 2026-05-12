// features/employerJobs/hooks/useEmployerApplications.js
import { useState, useCallback } from "react";
import { employerRepository } from "../repository/employerRepository";

export const useEmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    const result = await employerRepository.getApplications();
    if (result.success) setApplications(result.data);
    setLoading(false);
    return result;
  }, []);

  const updateStatus = useCallback(
    async (appId, status) => {
      const result = await employerRepository.updateApplicationStatus(
        appId,
        status
      );
      if (result.success) await loadApplications();
      return result;
    },
    [loadApplications]
  );

  return { applications, loading, loadApplications, updateStatus };
};
