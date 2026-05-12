'use client';

import { useEffect } from 'react';
import { getThemeFromStorage, saveThemeToStorage } from '@/lib/storage';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const theme = getThemeFromStorage();

        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';

        const effectiveTheme = theme === 'system' ? systemTheme : theme;

        if (effectiveTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return children;
}

export function useTheme() {
    const toggleTheme = (newTheme: 'light' | 'dark' | 'system') => {
        saveThemeToStorage(newTheme);

        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';

        const effectiveTheme = newTheme === 'system' ? systemTheme : newTheme;

        if (effectiveTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const currentTheme = getThemeFromStorage();
    return { toggleTheme, currentTheme };
}
