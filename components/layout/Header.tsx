import React from 'react';
import { Timer } from '../ui/Timer';

interface HeaderProps {
    currentSection: string;
    questionIndex?: number;
    totalQuestions?: number;
    timeRemaining?: number;
}

export function Header({ currentSection, questionIndex, totalQuestions, timeRemaining }: HeaderProps) {
    return (
        <header className="header">
            <div className="brand">
                <strong style={{ fontSize: '1.25rem', color: 'var(--text-color)' }}>Versant by Mohit</strong>
            </div>
            <div className="progress">
                <span style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                    {currentSection}
                    {questionIndex !== undefined && totalQuestions !== undefined &&
                        <span style={{ marginLeft: '12px' }}>Q {questionIndex} / {totalQuestions}</span>
                    }
                </span>
            </div>
            <div className="status">
                {timeRemaining !== undefined && <Timer secondsRemaining={timeRemaining} />}
            </div>
        </header>
    );
}
