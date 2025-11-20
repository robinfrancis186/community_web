import React from 'react';
import clsx from 'clsx';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    icon: Icon,
    ...props
}) => {
    const variants = {
        primary: 'bg-gradient-primary text-white shadow-lg shadow-primary/30 hover:shadow-glow-primary hover:scale-[1.02]',
        secondary: 'bg-gradient-secondary text-white shadow-lg shadow-secondary/30 hover:shadow-glow-secondary hover:scale-[1.02]',
        outline: 'border-2 border-slate-300 hover:border-primary hover:bg-primary/5 text-slate-700 hover:text-primary',
        ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02]',
        success: 'bg-gradient-to-r from-accent-green to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            <span className="relative z-10 flex items-center gap-2">
                {Icon && <Icon size={size === 'lg' ? 20 : 18} />}
                {children}
            </span>
        </button>
    );
};

export default Button;

