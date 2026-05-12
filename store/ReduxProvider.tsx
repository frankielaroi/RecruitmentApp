'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { AuthInitializer } from './AuthInitializer';

export function ReduxProvider({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <AuthInitializer>{children}</AuthInitializer>
        </Provider>
    );
}
