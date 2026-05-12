import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
    isAuthenticated: boolean;
    role: 'recruiter' | 'candidate' | null;
    user: {
        username: string;
        email: string;
    } | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    role: null,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Login recruiter
        loginRecruiter: (state, action: PayloadAction<{ username: string; email: string }>) => {
            state.isAuthenticated = true;
            state.role = 'recruiter';
            state.user = action.payload;
        },

        // Login candidate (no credentials needed, just session)
        loginCandidate: (state) => {
            state.isAuthenticated = true;
            state.role = 'candidate';
        },

        // Logout
        logout: (state) => {
            state.isAuthenticated = false;
            state.role = null;
            state.user = null;
        },

        // Restore session from localStorage
        restoreSession: (state, action: PayloadAction<AuthState>) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.role = action.payload.role;
            state.user = action.payload.user;
        },
    },
});

export const { loginRecruiter, loginCandidate, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
