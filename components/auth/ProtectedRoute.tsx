'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Spinner } from '@/components/ui/Button';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: Array<'recruiter' | 'candidate'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        setIsChecking(false);

        // Not authenticated
        if (!auth.isAuthenticated) {
            router.push('/login');
            return;
        }

        // Role-based access control
        if (allowedRoles && !allowedRoles.includes(auth.role!)) {
            router.push('/');
            return;
        }
    }, [auth, router, allowedRoles]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!auth.isAuthenticated) {
        return null;
    }

    if (allowedRoles && !allowedRoles.includes(auth.role!)) {
        return null;
    }

    return <>{children}</>;
}
