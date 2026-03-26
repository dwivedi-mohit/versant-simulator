'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Play, FileText, Video, ExternalLink, X } from 'lucide-react';

const RESOURCES = [
    {
        id: 1,
        title: "Versant Test Guide",
        type: "document",
        url: "https://drive.google.com/drive/folders/1c71KZ3AuP1mWL0fzBm_PsXoDOuHuPRQa?usp=sharing",
        description: "Official guides and tips to help you understand the test format and scoring."
    },
    {
        id: 2,
        title: "Versant Material",
        type: "document",
        url: "https://drive.google.com/file/d/14_ZiCSy0a5kTBprr0mVfCZ9aIteMuMTm/view?usp=sharing",
        description: "Comprehensive study materials, vocabularies, and preparation PDFs."
    },
    {
        id: 3,
        title: "Versant Samples Test",
        type: "document",
        url: "https://drive.google.com/drive/folders/1il0biMGPFycI69tguVWZwZPvD2FCaMb-?usp=sharing",
        description: "Sample test files and questions to practice and evaluate your current standing before the exam."
    },
    {
        id: 4,
        title: "Versant Sample",
        type: "document",
        url: "https://drive.google.com/drive/folders/1t2XLJTdN5v7YKSk2Z2JkdlXyYVhYg0PS?usp=sharing",
        description: "Additional Versant samples to review previous test structures and dialogue."
    }
];

export default function Home() {
    const router = useRouter();
    const [showSource, setShowSource] = useState(false);

    const startTest = () => {
        localStorage.removeItem('versant_questions');
        localStorage.removeItem('versant_answers');
        router.push('/test');
    };

    return (
        <main className="main-container" style={{ position: 'relative' }}>
            {/* Top Right Source Button */}
            <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10 }}>
                <Button variant="outline" onClick={() => setShowSource(true)}>
                    Source
                </Button>
            </div>

            <div className="content-wrapper" style={{ alignItems: 'center', paddingTop: '4rem' }}>
                <Card style={{ maxWidth: '600px', width: '100%', textAlign: 'left' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-color)' }}>
                        Versant by Mohit
                    </h1>
                    <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', color: 'var(--text-color)', opacity: 0.8 }}>
                        AI-powered speaking and writing assessment simulator. Ensure your microphone is connected and you are in a quiet environment.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                        <Button onClick={startTest} icon={<Play size={20} />} style={{ width: '100%', maxWidth: '300px', fontSize: '1.2rem', padding: '16px' }}>
                            Start Official Test
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/practice')} style={{ width: '100%', maxWidth: '300px' }}>
                            Practice Mode
                        </Button>
                    </div>
                </Card>

                <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>70</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Questions</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>80</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Total Marks</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>~15</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Minutes</div>
                    </div>
                </div>

                {/* Study Resources Section */}
                {/* Study Resources Modal */}
                {showSource && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)',
                        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '2rem'
                    }}>
                        <div style={{
                            backgroundColor: 'var(--bg-color)',
                            padding: '2.5rem',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '1000px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}>
                            <Button 
                                variant="outline" 
                                style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '8px', zIndex: 101 }}
                                onClick={() => setShowSource(false)}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </Button>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center', color: 'var(--text-color)' }}>
                                Overview & Preparation
                            </h2>
                            <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '2rem', color: 'var(--text-color)' }}>
                                Study materials, guides, and example videos to review before starting the test.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {RESOURCES.map((resource) => (
                                    <a 
                                        key={resource.id} 
                                        href={resource.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                                    >
                                        <Card style={{ 
                                            height: '100%', 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            backgroundColor: 'rgba(0,0,0,0.1)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                                                {resource.type === 'video' ? <Video size={24} /> : <FileText size={24} />}
                                                <h3 style={{ fontSize: '1.1rem', margin: 0, flex: 1, color: 'var(--text-color)' }}>{resource.title}</h3>
                                                <ExternalLink size={16} style={{ opacity: 0.5 }} />
                                            </div>
                                            <p style={{ opacity: 0.8, fontSize: '0.95rem', flex: 1, margin: 0, lineHeight: 1.5, color: 'var(--text-color)' }}>
                                                {resource.description}
                                            </p>
                                            
                                            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary-color)', opacity: 0.9 }}>
                                                {resource.type === 'video' ? 'Watch Video' : 'View Document'}
                                            </div>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
