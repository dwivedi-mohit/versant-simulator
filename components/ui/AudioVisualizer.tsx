'use client';

import React from 'react';

interface AudioVisualizerProps {
    isRecording: boolean;
    label?: string;
}

export function AudioVisualizer({ isRecording, label = "Recording..." }: AudioVisualizerProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '40px' }}>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: '6px',
                            backgroundColor: isRecording ? 'var(--error-color)' : 'var(--border-color)',
                            height: isRecording ? '100%' : '20%',
                            borderRadius: '3px',
                            animation: isRecording ? `pulseBar 0.8s infinite alternate ${i * 0.15}s` : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>
            {isRecording && (
                <span style={{ fontSize: '0.85rem', color: 'var(--error-color)', fontWeight: 600, animation: 'pulseText 1.5s infinite alternate' }}>
                    {label}
                </span>
            )}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes pulseBar {
          0% { height: 20%; }
          100% { height: 100%; }
        }
        @keyframes pulseText {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}} />
        </div>
    );
}
