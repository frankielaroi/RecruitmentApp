'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles =
        'font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white',
        secondary:
            'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white',
        danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white',
        ghost:
            'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {isLoading && <Spinner size="sm" />}
            {children}
        </button>
    );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    return (
        <div className={`${sizes[size]} animate-spin`}>
            <svg
                className="w-full h-full text-current"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
}

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' }) {
    const variants = {
        default: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white',
        success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
        warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
        danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
    };

    return (
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${variants[variant]}`}>
            {children}
        </span>
    );
}
