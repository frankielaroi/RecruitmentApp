'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
            return () => {
                window.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen, onClose]);

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
                    >
                        <div
                            className={`${sizes[size]} w-full bg-white dark:bg-slate-900 rounded-lg shadow-xl max-h-[90vh] overflow-auto`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">{children}</div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
