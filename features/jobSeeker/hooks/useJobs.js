// features/jobSeeker/hooks/useJobs.js
import { useState, useCallback } from "react";
import { jobsRepository } from "../repository/jobsRepository";

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    const result = await jobsRepository.getJobs();
    if (result.success) setJobs(result.data);
    setLoading(false);
    return result;
  }, []);

  return { jobs, loading, loadJobs };
};
