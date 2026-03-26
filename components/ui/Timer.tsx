import React, { useEffect, useState } from 'react';

interface TimerProps {
    secondsRemaining: number;
}

export function Timer({ secondsRemaining }: TimerProps) {
    const isUrgent = secondsRemaining <= 5 && secondsRemaining > 0;

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className={`timer ${isUrgent ? 'urgent' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {formatTime(secondsRemaining)}
        </div>
    );
}
