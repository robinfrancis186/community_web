import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useCertificates = () => {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchCertificates();
        }
    }, [user]);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            // Fetch user_courses where completed is true
            const { data, error } = await supabase
                .from('user_courses')
                .select(`
                    *,
                    courses (
                        id,
                        title,
                        thumbnail_url
                    )
                `)
                .eq('user_id', user.id)
                .eq('completed', true)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            // Transform data to match UI needs
            const formattedCerts = data.map(item => ({
                id: item.id,
                title: item.courses.title,
                date: new Date(item.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                id_code: `STRIDE-${new Date(item.updated_at).getFullYear()}-${item.course_id.slice(0, 3).toUpperCase()}-${item.id.slice(0, 4).toUpperCase()}`,
                image: item.courses.thumbnail_url
            }));

            setCertificates(formattedCerts || []);
        } catch (err) {
            console.error('Error fetching certificates:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { certificates, loading, error };
};
