'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/authSlice';
import { clearAuthFromStorage, getScreeningsFromStorage, getJobsFromStorage } from '@/lib/storage';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Button';
import { Screening, Job } from '@/lib/types';
import { CreateScreeningModal } from '@/components/recruiter/CreateScreeningModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppDispatch, RootState } from '@/store';

function JobsPageContent() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.auth);

    const [jobs, setJobs] = useState<Job[]>([]);
    const [screenings, setScreenings] = useState<Screening[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Fetch jobs from localStorage
        const savedJobs = getJobsFromStorage();
        setJobs(savedJobs);
        
        // Fetch screenings
        const saved = getScreeningsFromStorage();
        setScreenings(saved);
    }, []);

    const countScreeningsForJob = (jobId: string) => {
        return screenings.filter((s) => s.jobId === jobId).length;
    };

    const handleScreeningCreated = () => {
        const saved = getScreeningsFromStorage();
        setScreenings(saved);
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        clearAuthFromStorage();
        router.push('/login');
    };

    const employmentTypeColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
        'Full-time': 'success',
        'Part-time': 'warning',
        Internship: 'warning',
        NSS: 'default',
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Phone Screening Platform
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {auth.user?.username && `Welcome, ${auth.user.username}!`}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Button
                            onClick={handleLogout}
                            variant="secondary"
                            size="sm"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Available Jobs
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Manage phone screenings for your open positions
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        size="lg"
                    >
                        Create Phone Screening
                    </Button>
                </div>

                {jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            No jobs available. Contact your administrator.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <Card
                                key={job.id}
                                onClick={() => router.push(`/jobs/${job.id}`)}
                                className="cursor-pointer h-full flex flex-col"
                            >
                                <CardHeader>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        {job.location}
                                    </div>
                                </CardHeader>

                                <CardBody className="flex-grow">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                        {job.description}
                                    </p>
                                </CardBody>

                                <CardFooter className="flex-col gap-4">
                                    <div className="flex items-center justify-between w-full">
                                        <Badge variant={employmentTypeColors[job.employmentType]}>
                                            {job.employmentType}
                                        </Badge>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {countScreeningsForJob(job.id)}{' '}
                                            <span className="text-slate-600 dark:text-slate-400 font-normal">
                                                screening{countScreeningsForJob(job.id) !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/jobs/${job.id}`);
                                        }}
                                    >
                                        View Details →
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <CreateScreeningModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onScreeningCreated={handleScreeningCreated}
            />
        </main>
    );
}

export default function JobsPage() {
    return (
        <ProtectedRoute allowedRoles={['recruiter']}>
            <JobsPageContent />
        </ProtectedRoute>
    );
}
