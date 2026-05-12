import { AnalysisResult } from '@/lib/types';

export function generateMockAnalysis(): AnalysisResult {
    const strengths = [
        'Clear communication of technical concepts',
        'Strong problem-solving approach',
        'Good attention to detail',
        'Demonstrated teamwork and collaboration',
        'Shows growth mindset and willingness to learn',
    ];

    const concerns = [
        'Could provide more specific examples',
        'Limited experience in some areas',
        'Needs to clarify technical depth',
    ];

    const recommendations: Array<'advance' | 'reject' | 'hold'> = [
        'advance',
        'advance',
        'hold',
    ];

    return {
        summary:
            'Candidate demonstrated solid technical knowledge and communication skills. Overall interview went well with good responses to behavioral and technical questions.',
        strengths: strengths.slice(0, 2 + Math.floor(Math.random() * 2)),
        concerns: concerns.slice(0, 1 + Math.floor(Math.random() * 2)),
        recommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
    };
}

export function generateQuestionId(): string {
    return `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateSubmissionId(): string {
    return `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
