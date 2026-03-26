import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline';
    icon?: React.ReactNode;
}

export function Button({ children, variant = 'primary', icon, className = '', ...props }: ButtonProps) {
    return (
        <button
            className={`btn ${variant === 'outline' ? 'outline' : ''} ${className}`}
            {...props}
        >
            {icon && <span className="icon">{icon}</span>}
            {children}
        </button>
    );
}
