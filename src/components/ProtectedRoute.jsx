import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, profile, loading } = useAuth();
    const [profileLoading, setProfileLoading] = useState(true);

    // Give profile a moment to load if user exists but profile doesn't
    useEffect(() => {
        if (user && !profile && !loading) {
            const timer = setTimeout(() => {
                setProfileLoading(false);
            }, 2000); // Wait up to 2 seconds for profile
            return () => clearTimeout(timer);
        } else if (profile || !user) {
            setProfileLoading(false);
        }
    }, [user, profile, loading]);

    if (loading || (user && !profile && profileLoading)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">
                        {user && !profile ? 'Setting up your profile...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
