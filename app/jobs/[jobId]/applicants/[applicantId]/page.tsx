'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getSubmissionsFromStorage, getScreeningsFromStorage } from '@/lib/storage';
import { Submission, Screening, AnalysisResult } from '@/lib/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button, Spinner } from '@/components/ui/Button';
import { formatDate, generateMockAnalysis } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function ScreeningDetailsPageContent() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;
    const applicantId = params.applicantId as string;

    const [submission, setSubmission] = useState<Submission | null>(null);
    const [screening, setScreening] = useState<Screening | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const submissions = getSubmissionsFromStorage();
        const found = submissions.find((s) => s.id === applicantId && s.jobId === jobId);
        setSubmission(found || null);

        const screenings = getScreeningsFromStorage();
        const screeningFound = screenings.find((s) => s.jobId === jobId);
        setScreening(screeningFound || null);

        setLoading(false);
    }, [jobId, applicantId]);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAnalysis(generateMockAnalysis());
        setIsAnalyzing(false);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
                <Spinner size="lg" />
            </main>
        );
    }

    if (!submission || !screening) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        Submission not found
                    </h1>
                    <Button onClick={() => router.push(`/jobs/${jobId}`)}>Back to Job</Button>
                </div>
            </main>
        );
    }

    const recommendationColors: Record<string, string> = {
        advance: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        hold: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        reject: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    };

    const recommendationTextColors: Record<string, string> = {
        advance: 'text-green-800 dark:text-green-200',
        hold: 'text-yellow-800 dark:text-yellow-200',
        reject: 'text-red-800 dark:text-red-200',
    };

    const recommendationLabels: Record<string, string> = {
        advance: '✓ Advance to Next Round',
        hold: '⧖ Keep on Hold',
        reject: '✕ No Match',
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        href={`/jobs/${jobId}`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                    >
                        ← Back to Job
                    </Link>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Applicant Header */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                    {submission.candidateName}
                                </h1>
                                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                    <p>
                                        <span className="font-medium">Email:</span> {submission.candidateEmail}
                                    </p>
                                    <p>
                                        <span className="font-medium">Submitted:</span>{' '}
                                        {formatDate(submission.submittedAt)}
                                    </p>
                                    <p>
                                        <span className="font-medium">Responses:</span>{' '}
                                        {submission.answers.length} of {screening.questions.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Responses Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Screening Responses
                        </h2>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        {screening.questions.map((question, index) => {
                            const answer = submission.answers.find((a) => a.questionId === question.id);

                            return (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-slate-200 dark:border-slate-700 last:border-0 pb-6 last:pb-0"
                                >
                                    {/* Question */}
                                    <div className="mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-base font-semibold text-slate-900 dark:text-white">
                                                    {question.text}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    {question.responseType === 'audio' ? '🎤 Audio' : '📝 Text'} Response
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Answer */}
                                    {answer ? (
                                        <div className="ml-11">
                                            {question.responseType === 'audio' ? (
                                                <div className="bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center">
                                                    <svg
                                                        className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 18.75a6 6 0 006-6v-1.5m0 0a6 6 0 10-12 0v1.5m6 0v6m0-6v-1.5a6 6 0 10-12 0v1.5m6 0v6m0-6v-1.5"
                                                        />
                                                    </svg>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                                        Audio Player
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                                        Audio responses not available in demo
                                                    </p>
                                                    {answer.value && (
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic">
                                                            Note: {answer.value}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                                    <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                                                        {answer.value}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="ml-11 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                            <p className="text-slate-500 dark:text-slate-400 italic">
                                                No response provided
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </CardBody>
                </Card>

                {/* Analysis Section */}
                <div className="space-y-4">
                    <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !!analysis}
                        isLoading={isAnalyzing}
                        size="lg"
                        className="w-full"
                    >
                        {analysis ? 'Analysis Complete' : 'Analyze Response'}
                    </Button>

                    <AnimatePresence>
                        {analysis && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <Card className={`border-2 ${recommendationColors[analysis.recommendation]}`}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                AI Analysis
                                            </h3>
                                            <div
                                                className={`text-sm font-semibold px-3 py-1 rounded-full ${recommendationColors[analysis.recommendation]}`}
                                            >
                                                <span
                                                    className={`${recommendationTextColors[analysis.recommendation]}`}
                                                >
                                                    {recommendationLabels[analysis.recommendation]}
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardBody className="space-y-6">
                                        {/* Summary */}
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                                                Summary
                                            </h4>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                {analysis.summary}
                                            </p>
                                        </div>

                                        {/* Strengths */}
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                                                Strengths
                                            </h4>
                                            <ul className="space-y-2">
                                                {analysis.strengths.map((strength, i) => (
                                                    <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300">
                                                        <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                                                        <span>{strength}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Concerns */}
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                                                Areas to Explore
                                            </h4>
                                            <ul className="space-y-2">
                                                {analysis.concerns.map((concern, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex gap-2 text-slate-700 dark:text-slate-300"
                                                    >
                                                        <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                                                            ⚠
                                                        </span>
                                                        <span>{concern}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}

export default function ScreeningDetailsPage() {
    return (
        <ProtectedRoute allowedRoles={['recruiter']}>
            <ScreeningDetailsPageContent />
        </ProtectedRoute>
    );
}
