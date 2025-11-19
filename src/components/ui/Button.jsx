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
        primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25',
        secondary: 'bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25',
        outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700',
        ghost: 'hover:bg-slate-50 text-slate-500 hover:text-slate-900',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {Icon && <Icon size={size === 'lg' ? 20 : 18} />}
            {children}
        </button>
    );
};

export default Button;
