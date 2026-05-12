'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { jobs } from '@/data/jobs';
import { getScreeningsFromStorage, getSubmissionsFromStorage, saveSubmissionsToStorage } from '@/lib/storage';
import { Screening, Answer, Submission } from '@/lib/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { isValidEmail, generateSubmissionId } from '@/lib/utils';

type Step = 'welcome' | 'screening' | 'thank-you';

export default function ApplicantScreeningPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;

    const [job, setJob] = useState(jobs.find((j) => j.id === jobId));
    const [screening, setScreening] = useState<Screening | null>(null);
    const [step, setStep] = useState<Step>('welcome');

    // Welcome form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');

    // Screening state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const screenings = getScreeningsFromStorage();
        const found = screenings.find((s) => s.jobId === jobId);
        setScreening(found || null);
    }, [jobId]);

    const handleStartScreening = () => {
        let valid = true;

        // Validate name
        if (!name.trim()) {
            setNameError('Name is required');
            valid = false;
        } else {
            setNameError('');
        }

        // Validate email
        if (!email.trim()) {
            setEmailError('Email is required');
            valid = false;
        } else if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!valid) return;

        setStep('screening');
    };

    const handleNextQuestion = () => {
        if (!screening) return;

        const currentQuestion = screening.questions[currentQuestionIndex];

        // Add answer
        const newAnswer: Answer = {
            questionId: currentQuestion.id,
            responseType: currentQuestion.responseType,
            value: currentAnswer,
        };

        setAnswers([...answers, newAnswer]);
        setCurrentAnswer('');

        // Check if there are more questions
        if (currentQuestionIndex < screening.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // All questions answered, move to thank you
            handleSubmitScreening([...answers, newAnswer]);
        }
    };

    const handleSubmitScreening = async (finalAnswers: Answer[]) => {
        if (!screening || !job) return;

        setIsSubmitting(true);
        // Simulate submission
        await new Promise((resolve) => setTimeout(resolve, 500));

        const submission: Submission = {
            id: generateSubmissionId(),
            jobId,
            candidateName: name,
            candidateEmail: email,
            answers: finalAnswers,
            submittedAt: new Date().toISOString(),
        };

        const existing = getSubmissionsFromStorage();
        saveSubmissionsToStorage([...existing, submission]);

        setIsSubmitting(false);
        setStep('thank-you');
    };

    if (!job) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardBody className="text-center py-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Job not found
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            This screening link is no longer valid.
                        </p>
                        <Button onClick={() => router.push('/jobs')} variant="secondary">
                            Back to Home
                        </Button>
                    </CardBody>
                </Card>
            </main>
        );
    }

    if (!screening) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardBody className="text-center py-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            No screening available
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            A phone screening has not been set up for this position yet.
                        </p>
                    </CardBody>
                </Card>
            </main>
        );
    }

    const currentQuestion = screening.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / screening.questions.length) * 100;

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                    {/* Welcome Step */}
                    {step === 'welcome' && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="mt-20">
                                <CardHeader>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                        {job.title}
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Phone Screening
                                    </p>
                                </CardHeader>

                                <CardBody className="space-y-6">
                                    <div>
                                        <p className="text-slate-700 dark:text-slate-300 mb-4">
                                            Thank you for your interest in this role! We'd like to learn more about
                                            you through a short phone screening. This will take about 10-15 minutes.
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            You will answer {screening.questions.length} questions, one at a time.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            ℹ️ Please have your best answers ready. You can't go back after
                                            submitting each response.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                                Your Name <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => {
                                                    setName(e.target.value);
                                                    setNameError('');
                                                }}
                                                placeholder="Enter your full name"
                                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:outline-blue-500 ${nameError
                                                        ? 'border-red-500 dark:border-red-600'
                                                        : 'border-slate-300 dark:border-slate-600'
                                                    }`}
                                            />
                                            {nameError && (
                                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                    {nameError}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                                Your Email <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setEmailError('');
                                                }}
                                                placeholder="Enter your email address"
                                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:outline-blue-500 ${emailError
                                                        ? 'border-red-500 dark:border-red-600'
                                                        : 'border-slate-300 dark:border-slate-600'
                                                    }`}
                                            />
                                            {emailError && (
                                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                    {emailError}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleStartScreening}
                                        size="lg"
                                        className="w-full"
                                    >
                                        Start Screening
                                    </Button>
                                </CardBody>
                            </Card>
                        </motion.div>
                    )}

                    {/* Screening Step */}
                    {step === 'screening' && currentQuestion && (
                        <motion.div
                            key="screening"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-8"
                        >
                            <Card>
                                {/* Progress Bar */}
                                <div className="px-6 pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            Question {currentQuestionIndex + 1} of {screening.questions.length}
                                        </span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {Math.round(progress)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                                        />
                                    </div>
                                </div>

                                <CardBody className="space-y-6">
                                    {/* Question */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {currentQuestion.text}
                                        </h2>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                            {currentQuestion.responseType === 'audio' ? '🎤' : '📝'}{' '}
                                            {currentQuestion.responseType === 'audio' ? 'Audio' : 'Text'} Response
                                        </p>
                                    </div>

                                    {/* Answer Input */}
                                    {currentQuestion.responseType === 'audio' ? (
                                        <div>
                                            <div className="bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center mb-4">
                                                <svg
                                                    className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3"
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
                                                    Audio Recording Demo
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                                    For this demo, please use the text field below to enter your response
                                                </p>
                                            </div>

                                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                                Your Response
                                            </label>
                                            <textarea
                                                value={currentAnswer}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                                placeholder="Type your response here..."
                                                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:outline-blue-500 resize-none h-32"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                                Your Response
                                            </label>
                                            <textarea
                                                value={currentAnswer}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                                placeholder="Type your response here..."
                                                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:outline-blue-500 resize-none h-32"
                                            />
                                        </div>
                                    )}

                                    {/* Buttons */}
                                    <Button
                                        onClick={handleNextQuestion}
                                        disabled={!currentAnswer.trim() || isSubmitting}
                                        isLoading={isSubmitting}
                                        size="lg"
                                        className="w-full"
                                    >
                                        {isSubmitting
                                            ? 'Submitting...'
                                            : currentQuestionIndex === screening.questions.length - 1
                                                ? 'Submit Screening'
                                                : 'Next Question'}
                                    </Button>
                                </CardBody>
                            </Card>
                        </motion.div>
                    )}

                    {/* Thank You Step */}
                    {step === 'thank-you' && (
                        <motion.div
                            key="thank-you"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="mt-20">
                                <CardBody className="text-center py-12">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                        className="mb-4"
                                    >
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full">
                                            <svg
                                                className="w-8 h-8 text-green-600 dark:text-green-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                            Thank You!
                                        </h1>
                                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                                            Your screening responses have been submitted successfully.
                                        </p>

                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-left">
                                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                                                <span className="font-semibold">Submitted as:</span>
                                            </p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                Name: <span className="font-medium">{name}</span>
                                            </p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                Email: <span className="font-medium">{email}</span>
                                            </p>
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                                            Our team will review your responses and get back to you soon.
                                        </p>

                                        <Button
                                            onClick={() => router.push(`/jobs/${jobId}`)}
                                            size="lg"
                                            className="w-full"
                                        >
                                            Back to Job Posting
                                        </Button>
                                    </motion.div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
