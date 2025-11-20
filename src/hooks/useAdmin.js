import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAdminStats = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeCampuses: 0,
        totalImpactHours: 0,
        projects: 0,
        loading: true,
        error: null
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch Total Users
            const { count: userCount, error: userError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (userError) throw userError;

            // Fetch Active Campuses
            const { count: campusCount, error: campusError } = await supabase
                .from('campuses')
                .select('*', { count: 'exact', head: true });

            if (campusError) throw campusError;

            // Fetch Projects (Innovations)
            // Assuming 'innovations' table exists, if not we might need to create it or use a placeholder
            // For now, let's check if we can count from 'innovations' if it exists, otherwise 0
            // We'll try to fetch, if error (table doesn't exist), we default to 0
            let projectCount = 0;
            try {
                const { count, error } = await supabase
                    .from('innovations')
                    .select('*', { count: 'exact', head: true });
                if (!error) projectCount = count;
            } catch (e) {
                console.warn('Innovations table might not exist yet');
            }

            // Impact Hours - Placeholder calculation or fetch
            // For now, let's mock this or calculate based on events if possible
            // Let's just keep it static or random for now as we don't have a clear definition
            const impactHours = 45200; // Keep existing mock or calculate

            setStats({
                totalUsers: userCount || 0,
                activeCampuses: campusCount || 0,
                totalImpactHours: impactHours,
                projects: projectCount || 0,
                loading: false,
                error: null
            });

        } catch (error) {
            console.error('Error fetching admin stats:', error);
            setStats(prev => ({ ...prev, loading: false, error }));
        }
    };

    return stats;
};
