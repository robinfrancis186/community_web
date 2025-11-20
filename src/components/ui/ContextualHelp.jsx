import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContextualHelp = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/member/help')}
            className="fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-600 hover:scale-110 transition-all duration-300 z-40 group"
            aria-label="Get Help"
        >
            <HelpCircle size={24} />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Need Help?
            </span>
        </button>
    );
};

export default ContextualHelp;
