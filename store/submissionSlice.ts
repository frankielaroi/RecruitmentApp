import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Submission } from '@/lib/types';

interface SubmissionState {
    submissions: Submission[];
}

const initialState: SubmissionState = {
    submissions: [],
};

const submissionSlice = createSlice({
    name: 'submissions',
    initialState,
    reducers: {
        // Initialize submissions from localStorage
        initializeSubmissions: (state, action: PayloadAction<Submission[]>) => {
            state.submissions = action.payload;
        },

        // Add a new submission
        addSubmission: (state, action: PayloadAction<Submission>) => {
            state.submissions.push(action.payload);
        },

        // Get submissions by job ID
        getSubmissionsByJobId: (state, action: PayloadAction<string>) => {
            return state.submissions.filter((s) => s.jobId === action.payload);
        },

        // Get a specific submission
        getSubmissionById: (state, action: PayloadAction<string>) => {
            return state.submissions.find((s) => s.id === action.payload);
        },
    },
});

export const {
    initializeSubmissions,
    addSubmission,
    getSubmissionsByJobId,
    getSubmissionById,
} = submissionSlice.actions;

export default submissionSlice.reducer;
