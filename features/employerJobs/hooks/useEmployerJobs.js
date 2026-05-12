// features/employerJobs/hooks/useEmployerJobs.js
import { useState, useCallback } from "react";
import { employerRepository } from "../repository/employerRepository";

export const useEmployerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    const result = await employerRepository.getJobs();
    if (result.success) setJobs(result.data);
    setLoading(false);
    return result;
  }, []);

  const createJob = useCallback(
    async (payload) => {
      const result = await employerRepository.createJob(payload);
      if (result.success) await loadJobs();
      return result;
    },
    [loadJobs]
  );

  const updateJob = useCallback(
    async (jobId, payload) => {
      const result = await employerRepository.updateJob(jobId, payload);
      if (result.success) await loadJobs();
      return result;
    },
    [loadJobs]
  );

  const deleteJob = useCallback(
    async (jobId) => {
      const result = await employerRepository.deleteJob(jobId);
      if (result.success) await loadJobs();
      return result;
    },
    [loadJobs]
  );

  return { jobs, loading, loadJobs, createJob, updateJob, deleteJob };
};
