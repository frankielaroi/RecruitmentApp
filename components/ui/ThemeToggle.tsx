'use client';

import { useTheme } from '@/lib/ThemeProvider';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
    const { currentTheme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => {
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                toggleTheme(newTheme);
            }}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle theme"
        >
            {currentTheme === 'dark' ? (
                <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.415 0l.707.707a1 1 0 01-1.415 1.415l-.707-.707a1 1 0 010-1.415zm2.828 2.828a1 1 0 011.415 0l.707.707a1 1 0 01-1.415 1.415l-.707-.707a1 1 0 010-1.415zm2.828 2.829a1 1 0 011.415 0l.707.707a1 1 0 01-1.415 1.415l-.707-.707a1 1 0 010-1.415zM10 7a3 3 0 100 6 3 3 0 000-6zm.22 13.22a1 1 0 01-1.415 0l-.707-.707a1 1 0 011.415-1.415l.707.707a1 1 0 010 1.415zm2.122-2.118a1 1 0 01-1.415 0l-.707-.707a1 1 0 011.415-1.415l.707.707a1 1 0 010 1.415zm2.828-2.829a1 1 0 01-1.415 0l-.707-.707a1 1 0 011.415-1.415l.707.707a1 1 0 010 1.415zm2.828 2.829a1 1 0 01-1.415 0l-.707-.707a1 1 0 011.415-1.415l.707.707a1 1 0 010 1.415zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-1.78a1 1 0 01-1.415 0l-.707-.707a1 1 0 011.415-1.415l.707.707a1 1 0 010 1.415zM2.05 12.22a1 1 0 01-1.415 0l-.707-.707a1 1 0 011.415-1.415l.707.707a1 1 0 010 1.415z"
                        clipRule="evenodd"
                    />
                </svg>
            ) : (
                <svg
                    className="w-5 h-5 text-slate-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            )}
        </button>
    );
}
