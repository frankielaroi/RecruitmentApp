'use client';

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''
                } ${className}`}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }: CardProps) {
    return (
        <div className={`px-6 py-4 border-b border-slate-200 dark:border-slate-700 ${className}`}>
            {children}
        </div>
    );
}

export function CardBody({ children, className = '' }: CardProps) {
    return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardProps) {
    return (
        <div
            className={`px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3 ${className}`}
        >
            {children}
        </div>
    );
}
