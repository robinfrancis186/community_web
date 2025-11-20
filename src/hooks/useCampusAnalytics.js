import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useCampusAnalytics = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        participationByDept: [],
        impactMetrics: {
            livesImpacted: 0,
            devicesDistributed: 0,
            volunteerHours: 0,
            partnerSchools: 0
        },
        loading: true,
        error: null
    });

    useEffect(() => {
        if (user) {
            fetchAnalytics();
        }
    }, [user]);

    const fetchAnalytics = async () => {
        try {
            // Get user's campus_id
            const { data: profile } = await supabase
                .from('profiles')
                .select('campus_id')
                .eq('id', user.id)
                .single();

            const campusId = profile?.campus_id;

            if (!campusId) {
                setStats(prev => ({ ...prev, loading: false }));
                return;
            }

            // 1. Participation by Department (Mocked for now as we don't have 'department' in profiles yet)
            // Ideally: select department, count(*) from profiles where campus_id = ... group by department
            // For now, we'll return static data but structured for the UI
            const participationByDept = [
                { label: 'Computer Science', value: 75 },
                { label: 'Electronics', value: 60 },
                { label: 'Mechanical', value: 40 },
                { label: 'Civil', value: 25 },
            ];

            // 2. Impact Metrics
            // Lives Impacted: Sum of 'impact_score' from innovations/projects? Or manual entry?
            // For now, let's aggregate XP as a proxy for "Volunteer Hours"
            const { data: members, error: xpError } = await supabase
                .from('profiles')
                .select('xp')
                .eq('campus_id', campusId);

            if (xpError) throw xpError;
            const totalXp = members.reduce((sum, m) => sum + (m.xp || 0), 0);
            const volunteerHours = Math.floor(totalXp / 10); // Rough proxy: 10 XP = 1 Hour

            // Devices Distributed: Count of 'innovations' with status 'deployed'?
            // Partner Schools: Count of 'events' with type 'outreach'?

            // We'll keep some placeholders for metrics we don't have DB columns for yet
            // but we'll use the real calculated volunteer hours
            const impactMetrics = {
                livesImpacted: 1240, // Placeholder
                devicesDistributed: 450, // Placeholder
                volunteerHours: volunteerHours,
                partnerSchools: 15 // Placeholder
            };

            setStats({
                participationByDept,
                impactMetrics,
                loading: false,
                error: null
            });

        } catch (error) {
            console.error('Error fetching campus analytics:', error);
            setStats(prev => ({ ...prev, loading: false, error }));
        }
    };

    return stats;
};
