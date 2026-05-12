'use client';

import { useEffect } from 'react';
import { jobs as defaultJobs } from '@/data/jobs';
import { getJobsFromStorage, saveJobsToStorage } from '@/lib/storage';

export function useInitializeJobs() {
  useEffect(() => {
    const existingJobs = getJobsFromStorage();
    
    // If no jobs exist in localStorage, seed them
    if (existingJobs.length === 0) {
      saveJobsToStorage(defaultJobs);
    }
  }, []);
}
