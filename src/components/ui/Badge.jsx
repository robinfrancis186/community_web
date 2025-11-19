import React from 'react';
import clsx from 'clsx';

const Badge = ({ children, variant = 'primary', className }) => {
    const variants = {
        primary: 'bg-primary/10 text-primary border-primary/20',
        secondary: 'bg-secondary/10 text-secondary border-secondary/20',
        success: 'bg-green-500/10 text-green-400 border-green-500/20',
        warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        danger: 'bg-red-500/10 text-red-400 border-red-500/20',
        neutral: 'bg-slate-100 text-slate-500 border-slate-200',
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
