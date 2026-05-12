import { Job } from '@/lib/types';

export const jobs: Job[] = [
    {
        id: 'job-001',
        title: 'Frontend-Focused Full Stack Developer (NSS)',
        location: 'Remote, Ghana',
        employmentType: 'NSS',
        description:
            'Build delightful interfaces using Next.js and React. You will work on scalable frontend architecture, collaborate with designers, and ship features that users love. Strong TypeScript and React skills required.',
    },
    {
        id: 'job-002',
        title: 'Senior Backend Engineer',
        location: 'Lagos, Nigeria',
        employmentType: 'Full-time',
        description:
            'Lead backend architecture and system design. Mentor junior engineers, optimize API performance, and manage microservices infrastructure. Strong experience with Node.js, databases, and cloud platforms preferred.',
    },
    {
        id: 'job-003',
        title: 'UI/UX Designer',
        location: 'Remote, Africa',
        employmentType: 'Full-time',
        description:
            'Shape the visual and interaction design of our products. Create user-centered designs, design systems, and collaborate with product and engineering teams. Figma and design thinking expertise required.',
    },
    {
        id: 'job-004',
        title: 'Product Manager (Internship)',
        location: 'Remote, Global',
        employmentType: 'Internship',
        description:
            'Learn product management from the ground up. Work on feature discovery, user research, and cross-functional coordination. MBA or technical background preferred. Great opportunity for early-career professionals.',
    },
    {
        id: 'job-005',
        title: 'DevOps Engineer',
        location: 'Accra, Ghana',
        employmentType: 'Full-time',
        description:
            'Build and maintain CI/CD pipelines, manage cloud infrastructure (AWS/GCP), and ensure system reliability. Experience with Docker, Kubernetes, and infrastructure-as-code essential.',
    },
];

// Template questions based on job role
export const questionTemplates: Record<string, string[]> = {
    'Frontend-Focused Full Stack Developer (NSS)': [
        'Tell us about a complex React component you built. How did you structure it and why?',
        'Describe your experience with Next.js. What challenges have you faced?',
        'How do you approach state management in large applications?',
        'Walk us through a time you optimized frontend performance. What metrics did you improve?',
        'Tell us about your experience with TypeScript. How do you leverage its type system?',
        'How do you handle responsive design and cross-browser compatibility?',
        'Describe your testing approach for frontend code.',
    ],
    'Senior Backend Engineer': [
        'Tell us about a backend system you designed. What were the key design decisions?',
        'Describe your experience with database optimization. Give us a specific example.',
        'How do you approach API design? What principles do you follow?',
        'Tell us about a time you debugged a production incident. How did you solve it?',
        'What is your experience with microservices? What challenges did you face?',
        'How do you ensure code quality and maintainability in your teams?',
        'Describe your approach to scaling systems as they grow.',
    ],
    'UI/UX Designer': [
        'Walk us through your design process from discovery to handoff to engineers.',
        'Tell us about a redesign project. What did you learn from user research?',
        'How do you approach accessibility in your designs?',
        'Describe your experience building and maintaining design systems.',
        'Tell us about a difficult design decision you made. How did you validate it?',
        'How do you collaborate with product and engineering teams?',
        'What tools do you use for design and prototyping?',
    ],
    'Product Manager (Internship)': [
        'Tell us about a product feature you would build if you were PM here. Why?',
        'How do you think about measuring success for a new feature?',
        'Describe how you would research user needs for a feature.',
        'Tell us about a time you disagreed with a colleague. How did you resolve it?',
        'What do you think makes a good product experience?',
    ],
    'DevOps Engineer': [
        'Tell us about a CI/CD pipeline you designed or optimized.',
        'Describe your experience with containerization and orchestration.',
        'How do you approach infrastructure monitoring and alerting?',
        'Tell us about a time you prevented or responded to a production outage.',
        'How do you balance automation with maintainability?',
        'Describe your experience with IaC (Terraform, CloudFormation, etc.).',
    ],
};

// Get questions for a specific job
export function getQuestionsForJob(jobId: string): string[] {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return [];

    const templates = questionTemplates[job.title];
    return templates || getDefaultQuestions();
}

// Default fallback questions
function getDefaultQuestions(): string[] {
    return [
        'Tell us about a project you are most proud of.',
        'Describe your approach to problem-solving.',
        'How do you stay updated with industry trends?',
        'Tell us about a time you learned something new.',
        'What excites you about this role?',
        'How do you handle feedback and criticism?',
        'Describe your ideal work environment.',
    ];
}
