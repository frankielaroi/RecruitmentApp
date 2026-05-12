'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreSession } from './authSlice';
import { getAuthFromStorage } from '@/lib/storage';
import { useInitializeJobs } from '@/hooks/useInitializeJobs';
import { AppDispatch } from './index';

export function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  useInitializeJobs();

  useEffect(() => {
    const auth = getAuthFromStorage();
    if (auth) {
      dispatch(restoreSession(auth));
    }
  }, [dispatch]);

  return <>{children}</>;
}
