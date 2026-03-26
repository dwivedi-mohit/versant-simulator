'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MOCK_QUESTIONS } from '@/data/questions';

export default function ResultPage() {
    const router = useRouter();
    const [isEvaluating, setIsEvaluating] = useState(true);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [detailedStats, setDetailedStats] = useState<any[]>([]);

    useEffect(() => {
        const processResults = async () => {
            const answersStr = localStorage.getItem('versant_answers');
            if (!answersStr) {
                setIsEvaluating(false);
                return;
            }
            const answers = JSON.parse(answersStr);

            let sum = 0;
            const stats = [];

            const questionsStr = localStorage.getItem('versant_questions');
            const testQuestions = questionsStr ? JSON.parse(questionsStr) : [];

            // Channing into chunks of 5 to respect OpenAI API rate limits
            const chunkArray = (arr: any[], size: number) => {
                const results = [];
                for (let i = 0; i < arr.length; i += size) {
                    results.push(arr.slice(i, i + size));
                }
                return results;
            };

            const chunks = chunkArray(testQuestions, 5);
            let totalMaxScore = 0;

            for (const chunk of chunks) {
                const chunkEvals = await Promise.all(chunk.map(async (q: any) => {
                    const userAnswer = answers[q.id] || '';
                    const maxQScore = q.section === 'F' ? 6 : 1;
                    totalMaxScore += maxQScore;

                    if (!userAnswer) return { id: q.id, section: q.section, score: 0, maxScore: maxQScore, feedback: 'Skipped - No answer recorded.' };

                    try {
                        const res = await fetch('/api/evaluate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                section: q.section,
                                userAnswer,
                                correctAnswer: q.correctAnswer || q.promptAudioText || q.promptText,
                                questionText: q.promptText,
                            })
                        });
                        const data = await res.json();
                        const numericScore = Number(data.score) || 0;
                        const finalFeedback = data.feedback || (data.error ? `Error: ${data.error}` : 'No feedback provided');
                        return { id: q.id, section: q.section, score: numericScore, maxScore: maxQScore, feedback: finalFeedback, userAnswer };
                    } catch (e) {
                        return { id: q.id, section: q.section, score: 0, maxScore: maxQScore, feedback: 'Evaluation failed due to network or timeout error.' };
                    }
                }));

                for (const ev of chunkEvals) {
                    sum += ev.score;
                    stats.push(ev);
                }

                // Update UI incrementally
                setTotalScore(sum);
                setDetailedStats([...stats]);
            }
            // We append a custom field to track max possible score of the specific test length
            localStorage.setItem('versant_max_score', totalMaxScore.toString());
            setIsEvaluating(false);
        };

        processResults();
    }, []);

    return (
        <main className="main-container">
            <div className="content-wrapper" style={{ alignItems: 'center' }}>
                <Card style={{ maxWidth: '800px', width: '100%' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-color)', textAlign: 'center' }}>Test Complete</h1>

                    {isEvaluating ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div style={{ fontSize: '1.5rem', color: 'var(--primary-color)', animation: 'pulse 1s infinite alternate' }}>AI is grading your responses...</div>
                            <p style={{ marginTop: '1rem', opacity: 0.7 }}>Comparing pronunciations, evaluating grammar, and generating feedback.</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                                <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '4px solid var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{totalScore ?? '--'}</span>
                                </div>
                                <span style={{ fontSize: '1.2rem' }}>Total Marks Achieved</span>
                                <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>(Max points for this subset: {localStorage.getItem('versant_max_score') || 80})</span>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem' }}>Detailed AI Feedback</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {detailedStats.map((stat, i) => (
                                        <div key={i} style={{ padding: '1rem', background: 'var(--bg-color)', borderLeft: `4px solid ${stat.score > 0 ? 'var(--success-color)' : 'var(--error-color)'}`, borderRadius: '4px' }}>
                                            <div style={{ fontWeight: 'bold' }}>Section {stat.section} (Q {stat.id}) - Score: {stat.score} / {stat.maxScore}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.8, marginTop: '4px' }}>Your Answer: "{stat.userAnswer}"</div>
                                            <div style={{ fontSize: '0.9rem', color: 'gray', marginTop: '4px' }}>{stat.feedback}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <Button onClick={() => router.push('/')} style={{ width: '100%', maxWidth: '300px' }}>Take Another Test</Button>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </main >
    );
}
