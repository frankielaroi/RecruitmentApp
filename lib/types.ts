// Jobs
export interface Job {
    id: string;
    title: string;
    location: string;
    employmentType: 'Full-time' | 'Part-time' | 'Internship' | 'NSS';
    description: string;
}

// Screening & Questions
export type ResponseType = 'text' | 'audio';

export interface Question {
    id: string;
    text: string;
    responseType: ResponseType;
    isCustom: boolean;
}

export interface Screening {
    id: string;
    jobId: string;
    createdAt: string;
    questions: Question[];
}

// Applicant Submissions
export interface Answer {
    questionId: string;
    responseType: 'text' | 'audio';
    value: string;
}

export interface Submission {
    id: string;
    jobId: string;
    candidateName: string;
    candidateEmail: string;
    answers: Answer[];
    submittedAt: string;
}

// Analysis
export interface AnalysisResult {
    summary: string;
    strengths: string[];
    concerns: string[];
    recommendation: 'advance' | 'reject' | 'hold';
}
