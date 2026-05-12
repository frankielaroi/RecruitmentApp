import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import screeningReducer from './screeningSlice';
import submissionReducer from './submissionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        screenings: screeningReducer,
        submissions: submissionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
