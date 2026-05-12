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
    },
});

export const {
    initializeSubmissions,
    addSubmission,
} = submissionSlice.actions;

export const selectSubmissionsByJobId = (state: { submissions: SubmissionState }, jobId: string) => {
    return state.submissions.submissions.filter((s) => s.jobId === jobId);
};

export const selectSubmissionById = (state: { submissions: SubmissionState }, submissionId: string) => {
    return state.submissions.submissions.find((s) => s.id === submissionId);
};

export default submissionSlice.reducer;
