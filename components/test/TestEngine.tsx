'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Question } from '@/data/questions';
import { Header } from '../layout/Header';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useSpeech } from '@/hooks/useSpeech';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { AudioVisualizer } from '../ui/AudioVisualizer';

export function TestEngine({ questions }: { questions: Question[] }) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [status, setStatus] = useState<'intro' | 'playing' | 'reading' | 'recording' | 'typing' | 'processing'>('intro');
    const [timeLeft, setTimeLeft] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [textInput, setTextInput] = useState('');

    const { playTTS, transcribe, isSpeaking } = useSpeech();
    const { startRecording, stopRecording, isRecording, audioBlob } = useAudioRecorder();

    const currentQuestion = questions[currentIndex];
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initial prompt
    useEffect(() => {
        if (status === 'intro') {
            const wait = setTimeout(() => {
                handleStartQuestion();
            }, 2000);
            return () => clearTimeout(wait);
        }
    }, [status, currentIndex]);

    const handleStartQuestion = async () => {
        setTextInput('');
        if (currentQuestion.section === 'F') {
            setStatus('reading');
            setTimeLeft(30);
        } else if (currentQuestion.conversations && currentQuestion.conversations.length > 0) {
            setStatus('playing');
            for (const conv of currentQuestion.conversations) {
                // Speaker 1 -> Sarah (EXAVITQu4vr4xnSDxMaL), Speaker 2 -> Adam (pNInz6obpgDQGcFmaJcg) Default: Sarah
                const vid = conv.speaker === 'Speaker 2' ? 'pNInz6obpgDQGcFmaJcg' : 'EXAVITQu4vr4xnSDxMaL';
                await playTTS(conv.text, vid);
            }
            transitionToInput();
        } else if (['A', 'B', 'C', 'D'].includes(currentQuestion.section) && currentQuestion.promptAudioText) {
            setStatus('playing');
            await playTTS(currentQuestion.promptAudioText);
            transitionToInput();
        } else {
            transitionToInput();
        }
    };

    const transitionToInput = () => {
        if (['A', 'B', 'C'].includes(currentQuestion.section)) {
            setStatus('recording');
            startRecording();
            // Fallback safety timeout in case startRecording silently fails
            setTimeout(() => {
                if (status === 'recording' && timeLeft > 0) {
                    // Ensure UI isn't stuck forever if media fails
                }
            }, 1000);
        } else {
            setStatus('typing');
        }
        setTimeLeft(currentQuestion.timeLimit);
    };

    // Timer logic
    useEffect(() => {
        if ((status === 'recording' || status === 'typing' || status === 'reading') && timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if ((status === 'recording' || status === 'typing' || status === 'reading') && timeLeft === 0) {
            handleTimeUp();
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timeLeft, status]);

    const handleTimeUp = async () => {
        if (status === 'reading') {
            setStatus('typing');
            setTimeLeft(90); // Next phase is 90 seconds to type
        } else if (status === 'recording') {
            stopRecording();
            setStatus('processing');
        } else if (status === 'typing') {
            saveAnswerAndAdvance(textInput);
        }
    };

    // Process Audio when blob is ready
    useEffect(() => {
        if (status === 'processing') {
            if (audioBlob) {
                processAudio(audioBlob);
            } else {
                // Failsafe if audioBlob takes too long or fails completely
                const failsafe = setTimeout(() => {
                    if (status === 'processing') saveAnswerAndAdvance('');
                }, 3000);
                return () => clearTimeout(failsafe);
            }
        }
    }, [audioBlob, status]);

    const processAudio = async (blob: Blob) => {
        const text = await transcribe(blob);
        saveAnswerAndAdvance(text);
    };

    const saveAnswerAndAdvance = (answer: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setStatus('intro');
        } else {
            // Finish
            localStorage.setItem('versant_answers', JSON.stringify({ ...answers, [currentQuestion.id]: answer }));
            router.push('/result');
        }
    };

    const renderSectionContent = () => {
        switch (currentQuestion.section) {
            case 'A':
            case 'B':
            case 'C':
                return (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        {status === 'playing' ? (
                            <p style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>Listen carefully...</p>
                        ) : status === 'recording' ? (
                            <AudioVisualizer isRecording={true} label="Please Speak Now" />
                        ) : status === 'processing' ? (
                            <p>Processing your speech...</p>
                        ) : (
                            <p>Get ready...</p>
                        )}
                    </div>
                );
            case 'D':
                return (
                    <div style={{ marginTop: '2rem' }}>
                        {status === 'playing' ? (
                            <p style={{ textAlign: 'center', color: 'var(--primary-color)' }}>Listen and get ready to type...</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="Type what you heard..."
                                    style={{ width: '100%', height: '150px', padding: '1rem', background: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    autoFocus
                                />
                                <Button onClick={handleTimeUp} style={{ alignSelf: 'flex-end' }}>Submit Answer</Button>
                            </div>
                        )}
                    </div>
                );
            case 'E':
                return (
                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{currentQuestion.displaySentence || currentQuestion.promptText}</h3>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Fill the blank..."
                                style={{ flex: 1, padding: '1rem', background: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--primary-color)', borderRadius: '8px', fontSize: '1.1rem' }}
                                autoFocus
                            />
                            <Button onClick={handleTimeUp}>Submit</Button>
                        </div>
                    </div>
                );
            case 'F':
                return (
                    <div style={{ marginTop: '2rem' }}>
                        {status === 'reading' ? (
                            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                                <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{currentQuestion.promptText}</p>
                                <p style={{ marginTop: '1rem', color: 'var(--primary-color)' }}>Read the passage carefully. You have 30 seconds.</p>
                            </div>
                        ) : status === 'typing' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="Reconstruct the passage in your own words..."
                                    style={{ width: '100%', height: '200px', padding: '1rem', background: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    autoFocus
                                />
                                <Button onClick={handleTimeUp} style={{ alignSelf: 'flex-end' }}>Submit Reconstruction</Button>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}><p>Get ready...</p></div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header
                currentSection={`Part ${currentQuestion.section}`}
                questionIndex={currentIndex + 1}
                totalQuestions={questions.length}
                timeRemaining={status === 'recording' || status === 'typing' || status === 'reading' ? timeLeft : undefined}
            />
            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ opacity: 0.7, marginBottom: '1rem', textAlign: 'center' }}>{currentQuestion.instructions}</p>
                <Card>
                    {renderSectionContent()}
                </Card>
            </div>
        </div>
    );
}
