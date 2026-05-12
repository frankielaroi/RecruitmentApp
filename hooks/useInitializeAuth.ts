'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreSession } from '@/store/authSlice';
import { getAuthFromStorage } from '@/lib/storage';
import { AppDispatch } from '@/store';

export function useInitializeAuth() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const auth = getAuthFromStorage();
        if (auth) {
            dispatch(restoreSession(auth));
        }
    }, [dispatch]);
}
