import React from 'react';
import clsx from 'clsx';

const Badge = ({ children, variant = 'primary', className, gradient = false }) => {
    const variants = {
        primary: gradient
            ? 'bg-gradient-primary text-white border-0'
            : 'bg-primary/10 text-primary border-primary/20',
        secondary: gradient
            ? 'bg-gradient-secondary text-white border-0'
            : 'bg-secondary/10 text-secondary border-secondary/20',
        success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        danger: 'bg-red-500/10 text-red-600 border-red-500/20',
        neutral: 'bg-slate-100 text-slate-600 border-slate-200',
        info: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
        pink: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

export default Badge;

