'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { getScreeningsFromStorage, getSubmissionsFromStorage, getJobsFromStorage } from '@/lib/storage';
import { Screening, Submission, Job } from '@/lib/types';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button, Badge } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ShareScreeningLink } from '@/components/recruiter/ShareScreeningLink';

function JobDetailPageContent() {
    const router = useRouter();
    const params = useParams();
    const jobId = params.jobId as string;

    const [job, setJob] = useState<Job | null>(null);
    const [screening, setScreening] = useState<Screening | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        // Fetch job from localStorage
        const jobs = getJobsFromStorage();
        const foundJob = jobs.find((j) => j.id === jobId);
        setJob(foundJob || null);

        const screenings = getScreeningsFromStorage();
        const found = screenings.find((s) => s.jobId === jobId);
        setScreening(found || null);

        const allSubmissions = getSubmissionsFromStorage();
        const relevant = allSubmissions.filter((s) => s.jobId === jobId);
        setSubmissions(relevant);
    }, [jobId]);

    if (!job) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        Job not found
                    </h1>
                    <Button onClick={() => router.push('/jobs')}>Back to Jobs</Button>
                </div>
            </main>
        );
    }

    const colorMap: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
        'Full-time': 'success',
        'Part-time': 'warning',
        Internship: 'warning',
        NSS: 'default',
    };
    const employmentTypeColor = colorMap[job.employmentType] || 'default';

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        href="/jobs"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                    >
                        ← Back to Jobs
                    </Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Job Header */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                    {job.title}
                                </h1>
                                <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-1">
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
                                    <Badge variant={employmentTypeColor}>{job.employmentType}</Badge>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{job.description}</p>
                    </CardHeader>
                </Card>

                {/* Screening Status */}
                <Card className="mb-8">
                    <CardHeader>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Phone Screening
                        </h2>
                        {screening ? (
                            <div className="space-y-3">
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                                        ✓ Screening Created
                                    </p>
                                    <p className="text-xs text-green-700 dark:text-green-300">
                                        {screening.questions.length} questions • Created{' '}
                                        {formatDate(screening.createdAt)}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-900 dark:text-white">
                                        Candidate Link
                                    </label>
                                    <ShareScreeningLink jobId={jobId} screeningId={screening.id} />
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                                    ⚠ No screening created yet
                                </p>
                                <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
                                    Create a phone screening from the Jobs page to generate a candidate link.
                                </p>
                                <Link href="/jobs">
                                    <Button size="sm" variant="secondary">
                                        Back to Create Screening
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardHeader>
                </Card>

                {/* Applicants Section */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Applicant Responses
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {submissions.length}{' '}
                            {submissions.length === 1 ? 'submission' : 'submissions'}
                        </p>
                    </CardHeader>

                    {submissions.length === 0 ? (
                        <CardBody>
                            <div className="text-center py-8">
                                <svg
                                    className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="text-slate-600 dark:text-slate-400 font-medium">
                                    No responses yet
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                                    Share the candidate link to start collecting responses
                                </p>
                            </div>
                        </CardBody>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                            Submitted
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((submission) => (
                                        <tr
                                            key={submission.id}
                                            className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                                                {submission.candidateName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {submission.candidateEmail}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {formatDate(submission.submittedAt)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        router.push(
                                                            `/jobs/${jobId}/applicants/${submission.id}`
                                                        )
                                                    }
                                                >
                                                    View Responses
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </main>
    );
}

export default function JobDetailPage() {
    return (
        <ProtectedRoute allowedRoles={['recruiter']}>
            <JobDetailPageContent />
        </ProtectedRoute>
    );
}
