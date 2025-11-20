import React from 'react';
import React from 'react';
import logo from '../../assets/stride-logo.png';

const Preloader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="relative flex flex-col items-center">
                {/* Logo Container */}
                <div className="relative w-24 h-24 mb-4">
                    {/* Pulsing Circle Background */}
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse delay-75"></div>

                    {/* Logo Image (Using text for now if image not available, or placeholder) */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-xl border-4 border-white dark:border-slate-700 overflow-hidden">
                        <img src={logo} alt="STRIDE" className="w-16 h-16 object-contain" />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                        STRIDE
                    </h2>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-0"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
