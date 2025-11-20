import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, hover = false, glass = false, ...props }) => {
    return (
        <div
            {...props}
            className={clsx(
                'relative overflow-hidden rounded-2xl p-6',
                glass
                    ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-glass'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-soft',
                hover && 'card-hover group cursor-pointer',
                className
            )}
        >
            {/* Gradient overlay on hover */}
            {hover && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            )}

            {/* Shimmer effect on hover */}
            {hover && (
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            )}

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Card;

