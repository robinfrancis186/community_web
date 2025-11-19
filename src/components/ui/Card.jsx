import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, hover = false, ...props }) => {
    return (
        <div
            {...props}
            className={clsx(
                'bg-surface border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm',
                hover && 'hover:border-primary/50 hover:shadow-md transition-all duration-300 group',
                className
            )}
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Card;
