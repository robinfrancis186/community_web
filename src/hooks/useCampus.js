import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useCampusStats = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalMembers: 0,
        impactScore: 0,
        eventsHosted: 0,
        certificatesIssued: 0,
        loading: true,
        error: null
    });

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            // Get user's profile to find campus_id
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('campus_id')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;
            const campusId = profile?.campus_id;

            if (!campusId) {
                setStats(prev => ({ ...prev, loading: false }));
                return;
            }

            // 1. Total Members
            const { count: memberCount, error: memberError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('campus_id', campusId);

            if (memberError) throw memberError;

            // 2. Events Hosted
            // Assuming events table has campus_id. If not, this might fail or return 0 if we don't filter.
            // Let's try to filter by campus_id if column exists, otherwise just count all (fallback)
            // For now, we'll assume it exists or we'll catch error
            let eventCount = 0;
            try {
                const { count, error } = await supabase
                    .from('events')
                    .select('*', { count: 'exact', head: true })
                    .eq('campus_id', campusId);
                if (!error) eventCount = count;
            } catch (e) {
                console.warn('Events table might not have campus_id');
            }

            // 3. Impact Score (Sum of XP of members)
            const { data: members, error: xpError } = await supabase
                .from('profiles')
                .select('xp')
                .eq('campus_id', campusId);

            if (xpError) throw xpError;
            const totalXp = members.reduce((sum, m) => sum + (m.xp || 0), 0);

            // 4. Certificates Issued (Completed courses by members)
            // This is complex: join user_courses with profiles
            // user_courses -> user_id -> profiles.campus_id
            const { count: certCount, error: certError } = await supabase
                .from('user_courses')
                .select('*, profiles!inner(campus_id)', { count: 'exact', head: true })
                .eq('completed', true)
                .eq('profiles.campus_id', campusId);

            if (certError) throw certError;

            setStats({
                totalMembers: memberCount || 0,
                impactScore: totalXp || 0,
                eventsHosted: eventCount || 0,
                certificatesIssued: certCount || 0,
                loading: false,
                error: null
            });

        } catch (error) {
            console.error('Error fetching campus stats:', error);
            setStats(prev => ({ ...prev, loading: false, error }));
        }
    };

    return stats;
};

export const useCampusMembers = () => {
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user) {
            fetchMembers();
        }
    }, [user, searchTerm]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            // Get user's profile to find campus_id
            const { data: profile } = await supabase
                .from('profiles')
                .select('campus_id')
                .eq('id', user.id)
                .single();

            const campusId = profile?.campus_id;

            if (!campusId) {
                setMembers([]);
                setLoading(false);
                return;
            }

            let query = supabase
                .from('profiles')
                .select('*')
                .eq('campus_id', campusId)
                .order('full_name');

            if (searchTerm) {
                query = query.ilike('full_name', `%${searchTerm}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setMembers(data || []);

        } catch (error) {
            console.error('Error fetching campus members:', error);
        } finally {
            setLoading(false);
        }
    };

    return { members, loading, searchTerm, setSearchTerm };
};
