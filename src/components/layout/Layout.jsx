import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background text-white flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Navbar />
                <main className="flex-1 mt-16 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
