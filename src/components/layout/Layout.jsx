import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import PageTransition from './PageTransition';
import ContextualHelp from '../ui/ContextualHelp';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Navbar />
                <main className="flex-1 mt-16 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full">
                        <AnimatePresence mode="wait">
                            <PageTransition key={location.pathname} className="w-full">
                                <Outlet />
                            </PageTransition>
                        </AnimatePresence>
                    </div>
                </main>
                <ContextualHelp />
            </div>
        </div>
    );
};

export default Layout;
