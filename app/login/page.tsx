'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginRecruiter } from '@/store/authSlice';
import { saveAuthToStorage } from '@/lib/storage';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AppDispatch } from '@/store';

const VALID_USERNAME = 'recruiter';
const VALID_PASSWORD = 'password123';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            return;
        }

        setIsLoading(true);
        // Simulate auth check
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            const authData = {
                isAuthenticated: true,
                role: 'recruiter' as const,
                user: {
                    username,
                    email: 'recruiter@remotown.com',
                },
            };

            dispatch(loginRecruiter(authData.user));
            saveAuthToStorage(authData);
            router.push('/jobs');
        } else {
            setError('Invalid username or password');
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardBody className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Phone Screening
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Recruiter Dashboard
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter username"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:outline-blue-500"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter password"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:outline-blue-500"
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            disabled={isLoading}
                            size="lg"
                            className="w-full mt-6"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 font-medium">
                            Demo Credentials:
                        </p>
                        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                            <p>
                                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                    recruiter
                                </span>
                            </p>
                            <p>
                                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                    password123
                                </span>
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </main>
    );
}
