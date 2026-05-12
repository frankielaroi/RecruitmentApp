import { Screening, Submission, Job } from '@/lib/types';
import { AuthState } from '@/store/authSlice';

const SCREENINGS_KEY = 'aihrly_screenings';
const SUBMISSIONS_KEY = 'aihrly_submissions';
const AUTH_KEY = 'aihrly_auth';
const THEME_KEY = 'aihrly_theme';
const JOBS_KEY = 'aihrly_jobs';

// Auth
export function getAuthFromStorage(): AuthState | null {
    if (typeof window === 'undefined') return null;
    try {
        const data = localStorage.getItem(AUTH_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

export function saveAuthToStorage(auth: AuthState): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    } catch {
        console.error('Failed to save auth to localStorage');
    }
}

export function clearAuthFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(AUTH_KEY);
    } catch {
        console.error('Failed to clear auth from localStorage');
    }
}

// Screenings
export function getScreeningsFromStorage(): Screening[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(SCREENINGS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function saveScreeningsToStorage(screenings: Screening[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(SCREENINGS_KEY, JSON.stringify(screenings));
    } catch {
        console.error('Failed to save screenings to localStorage');
    }
}

// Submissions
export function getSubmissionsFromStorage(): Submission[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(SUBMISSIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function saveSubmissionsToStorage(submissions: Submission[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    } catch {
        console.error('Failed to save submissions to localStorage');
    }
}

// Theme
export function getThemeFromStorage(): 'light' | 'dark' | 'system' {
    if (typeof window === 'undefined') return 'system';
    try {
        const data = localStorage.getItem(THEME_KEY);
        return (data as 'light' | 'dark' | 'system') || 'system';
    } catch {
        return 'system';
    }
}

export function saveThemeToStorage(theme: 'light' | 'dark' | 'system'): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch {
        console.error('Failed to save theme to localStorage');
    }
}
// Jobs
export function getJobsFromStorage(): Job[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(JOBS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveJobsToStorage(jobs: Job[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  } catch {
    console.error('Failed to save jobs to localStorage');
  }
}