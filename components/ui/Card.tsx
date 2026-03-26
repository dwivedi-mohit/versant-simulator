import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function Card({ children, className = '', style }: CardProps) {
    return (
        <div className={`card ${className}`} style={style}>
            {children}
        </div>
    );
}
