import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Screening, Question } from '@/lib/types';

interface ScreeningState {
    screenings: Screening[];
}

const initialState: ScreeningState = {
    screenings: [],
};

const screeningSlice = createSlice({
    name: 'screenings',
    initialState,
    reducers: {
        // Initialize screenings from localStorage
        initializeScreenings: (state, action: PayloadAction<Screening[]>) => {
            state.screenings = action.payload;
        },

        // Create a new screening
        createScreening: (
            state,
            action: PayloadAction<{ jobId: string; questions: Question[] }>
        ) => {
            const newScreening: Screening = {
                id: `screening-${Date.now()}`,
                jobId: action.payload.jobId,
                questions: action.payload.questions,
                createdAt: new Date().toISOString(),
            };
            state.screenings.push(newScreening);
        },

        // Update a screening's questions
        updateScreeningQuestions: (
            state,
            action: PayloadAction<{ screeningId: string; questions: Question[] }>
        ) => {
            const screening = state.screenings.find((s) => s.id === action.payload.screeningId);
            if (screening) {
                screening.questions = action.payload.questions;
            }
        },

        // Add a question to a screening
        addQuestionToScreening: (
            state,
            action: PayloadAction<{ screeningId: string; question: Question }>
        ) => {
            const screening = state.screenings.find((s) => s.id === action.payload.screeningId);
            if (screening) {
                screening.questions.push(action.payload.question);
            }
        },

        // Remove a question from a screening
        removeQuestionFromScreening: (
            state,
            action: PayloadAction<{ screeningId: string; questionId: string }>
        ) => {
            const screening = state.screenings.find((s) => s.id === action.payload.screeningId);
            if (screening) {
                screening.questions = screening.questions.filter(
                    (q) => q.id !== action.payload.questionId
                );
            }
        },

        // Delete a screening
        deleteScreening: (state, action: PayloadAction<string>) => {
            state.screenings = state.screenings.filter((s) => s.id !== action.payload);
        },

        // Get screening by job ID
        getScreeningByJobId: (state, action: PayloadAction<string>) => {
            return state.screenings.find((s) => s.jobId === action.payload);
        },
    },
});

export const {
    initializeScreenings,
    createScreening,
    updateScreeningQuestions,
    addQuestionToScreening,
    removeQuestionFromScreening,
    deleteScreening,
} = screeningSlice.actions;

export default screeningSlice.reducer;
