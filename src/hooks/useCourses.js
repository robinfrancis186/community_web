import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCourses(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { courses, loading, error, refetch: fetchCourses };
};

export const useUserCourses = (userId) => {
    const [userCourses, setUserCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUserCourses = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('user_courses')
                    .select(`
            *,
            courses (*)
          `)
                    .eq('user_id', userId);

                if (error) throw error;
                setUserCourses(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserCourses();
    }, [userId]);

    return { userCourses, loading, error };
};

export const useEnrollCourse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const enroll = async (courseId, userId) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('user_courses')
                .insert([{ course_id: courseId, user_id: userId, progress: 0 }])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (err) {
            setError(err.message);
            return { data: null, error: err };
        } finally {
            setLoading(false);
        }
    };

    return { enroll, loading, error };
};
