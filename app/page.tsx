'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Home() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.isAuthenticated && auth.role === 'recruiter') {
      router.push('/jobs');
    } else {
      router.push('/login');
    }
  }, [auth, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Phone Screening Platform
        </h1>
        <p className="text-slate-600 dark:text-slate-300">Loading...</p>
      </div>
    </div>
  );
}
