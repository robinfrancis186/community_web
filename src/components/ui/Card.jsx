import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, hover = false, ...props }) => {
    return (
        <div
            {...props}
            className={clsx(
                'bg-surface border border-white/5 rounded-2xl p-6 relative overflow-hidden',
                hover && 'hover:border-primary/50 transition-colors duration-300 group',
                className
            )}
        >
            {/* Glass gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Card;
