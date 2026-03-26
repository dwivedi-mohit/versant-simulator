'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getPracticeSet } from '@/data/questions';

export default function PracticePage() {
    const router = useRouter();

    const startPracticeSet = (setId: number) => {
        // Pre-generate the specific set and save it so the test engine picks it up
        const setQuestions = getPracticeSet(setId);
        localStorage.setItem('versant_questions', JSON.stringify(setQuestions));
        localStorage.setItem('versant_answers', JSON.stringify({}));
        router.push('/test');
    };

    return (
        <main className="main-container">
            <div className="content-wrapper" style={{ alignItems: 'center', width: '100%' }}>
                <Card style={{ maxWidth: '800px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2rem', color: 'var(--text-color)' }}>Select Practice Set</h1>
                        <Button variant="outline" onClick={() => router.push('/')}>Back to Home</Button>
                    </div>

                    <p style={{ marginBottom: '2rem', color: 'var(--text-color)', opacity: 0.8 }}>
                        Choose from 20 carefully calibrated practice sets. Each set contains 70 unique questions strictly following the Versant test format.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '1rem'
                    }}>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                            <Button
                                key={num}
                                variant={num % 2 === 0 ? "outline" : "primary"}
                                onClick={() => startPracticeSet(num)}
                                style={{ padding: '1rem', fontSize: '1.1rem' }}
                            >
                                Practice Set {num}
                            </Button>
                        ))}
                    </div>
                </Card>
            </div>
        </main>
    );
}
