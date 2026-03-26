'use client';

import { useEffect, useState } from 'react';
import { TestEngine } from '@/components/test/TestEngine';
import { generatePracticeSet } from '@/data/questions';

export default function TestPage() {
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('versant_questions');
        if (stored) {
            setQuestions(JSON.parse(stored));
        } else {
            const newSet = generatePracticeSet();
            localStorage.setItem('versant_questions', JSON.stringify(newSet));
            setQuestions(newSet);
        }
    }, []);

    if (questions.length === 0) {
        return <div style={{ color: 'var(--text-color)', padding: '2rem', textAlign: 'center' }}>Generating practice set...</div>;
    }

    return (
        <main className="main-container">
            <TestEngine questions={questions} />
        </main>
    );
}
