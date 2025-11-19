import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, max = 100, color = 'primary', showLabel = false, className }) => {
    const percentage = Math.min(100, Math.max(0, (progress / max) * 100));

    const colors = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
    };

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-slate-900 font-medium">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={clsx('h-full rounded-full', colors[color])}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
