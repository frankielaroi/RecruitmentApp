'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobs, getQuestionsForJob } from '@/data/jobs';
import { Question, ResponseType, Screening } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button, Spinner } from '@/components/ui/Button';
import { saveScreeningsToStorage, getScreeningsFromStorage } from '@/lib/storage';
import { generateQuestionId } from '@/lib/utils';

interface CreateScreeningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScreeningCreated: () => void;
}

type Step = 'select-job' | 'generate-questions' | 'edit-questions' | 'review';

export function CreateScreeningModal({
    isOpen,
    onClose,
    onScreeningCreated,
}: CreateScreeningModalProps) {
    const [step, setStep] = useState<Step>('select-job');
    const [selectedJobId, setSelectedJobId] = useState<string>('');
    const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateQuestions = async () => {
        if (!selectedJobId) return;

        setIsGenerating(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 600));

        const questionTexts = getQuestionsForJob(selectedJobId);
        const questions: Question[] = questionTexts.map((text) => ({
            id: generateQuestionId(),
            text,
            responseType: 'text' as ResponseType,
            isCustom: false,
        }));

        setGeneratedQuestions(questions);
        setIsGenerating(false);
        setStep('edit-questions');
    };

    const handleAddCustomQuestion = () => {
        const newQuestion: Question = {
            id: generateQuestionId(),
            text: 'Enter your custom question',
            responseType: 'text',
            isCustom: true,
        };
        setGeneratedQuestions([...generatedQuestions, newQuestion]);
    };

    const handleRemoveQuestion = (questionId: string) => {
        setGeneratedQuestions(generatedQuestions.filter((q) => q.id !== questionId));
    };

    const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
        setGeneratedQuestions(
            generatedQuestions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
        );
    };

    const handleSaveScreening = () => {
        if (!selectedJobId || generatedQuestions.length === 0) return;

        const newScreening: Screening = {
            id: `screening-${Date.now()}`,
            jobId: selectedJobId,
            createdAt: new Date().toISOString(),
            questions: generatedQuestions,
        };

        const existing = getScreeningsFromStorage();
        saveScreeningsToStorage([...existing, newScreening]);

        // Reset and close
        setStep('select-job');
        setSelectedJobId('');
        setGeneratedQuestions([]);
        onScreeningCreated();
        onClose();
    };

    const selectedJob = jobs.find((j) => j.id === selectedJobId);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Phone Screening" size="xl">
            {/* Step 1: Select Job */}
            <AnimatePresence mode="wait">
                {step === 'select-job' && (
                    <motion.div
                        key="select-job"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-900 dark:text-white">
                                Select a Job
                            </label>
                            <select
                                value={selectedJobId}
                                onChange={(e) => setSelectedJobId(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:outline-blue-500"
                            >
                                <option value="">Choose a job...</option>
                                {jobs.map((job) => (
                                    <option key={job.id} value={job.id}>
                                        {job.title} - {job.location}
                                    </option>
                                ))}
                            </select>
                            {selectedJob && (
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {selectedJob.description}
                                </p>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="secondary"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleGenerateQuestions}
                                    disabled={!selectedJobId}
                                    isLoading={isGenerating}
                                    className="flex-1"
                                >
                                    {isGenerating ? 'Generating...' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Review Generated Questions */}
                {step === 'edit-questions' && (
                    <motion.div
                        key="edit-questions"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Screening Questions
                            </label>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {generatedQuestions.map((q, index) => (
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        Q{index + 1}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={q.text}
                                                        onChange={(e) =>
                                                            handleUpdateQuestion(q.id, { text: e.target.value })
                                                        }
                                                        className="flex-grow px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                    />
                                                </div>
                                                <select
                                                    value={q.responseType}
                                                    onChange={(e) =>
                                                        handleUpdateQuestion(q.id, {
                                                            responseType: e.target.value as ResponseType,
                                                        })
                                                    }
                                                    className="text-xs px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                                >
                                                    <option value="text">Text Response</option>
                                                    <option value="audio">Audio Response</option>
                                                </select>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveQuestion(q.id)}
                                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600 dark:text-red-400"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={handleAddCustomQuestion}
                            className="w-full"
                        >
                            + Add Custom Question
                        </Button>

                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setStep('select-job');
                                    setGeneratedQuestions([]);
                                }}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleSaveScreening}
                                disabled={generatedQuestions.length === 0}
                                className="flex-1"
                            >
                                Create Screening
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
}
