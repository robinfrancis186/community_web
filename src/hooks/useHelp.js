import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const formatCategory = (category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon,
    sort_order: category.sort_order,
    articles: (category.help_articles || []).map((article) => ({
        id: article.id,
        question: article.question,
        answer: article.answer,
        tags: article.tags || [],
    })),
});

const formatSupportRequest = (request) => ({
    id: request.id,
    title: request.title,
    description: request.description,
    status: request.status,
    created_at: request.created_at,
    category: request.category ? request.category.name : 'General',
});

export const useHelpCenter = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [supportRequests, setSupportRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchSupportRequests = useCallback(async () => {
        if (!user) {
            setSupportRequests([]);
            return;
        }

        const { data, error } = await supabase
            .from('support_requests')
            .select(`
                id,
                title,
                description,
                status,
                created_at,
                category:help_categories(name)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        setSupportRequests((data || []).map(formatSupportRequest));
    }, [user]);

    const fetchCategories = useCallback(async () => {
        const { data, error } = await supabase
            .from('help_categories')
            .select(`
                id,
                name,
                description,
                icon,
                sort_order,
                help_articles (
                    id,
                    question,
                    answer,
                    tags
                )
            `)
            .order('sort_order', { ascending: true });

        if (error) {
            throw error;
        }

        setCategories((data || []).map(formatCategory));
    }, []);

    const fetchHelpData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            await Promise.all([fetchCategories(), fetchSupportRequests()]);
        } catch (err) {
            console.error('Failed to load help center data', err);
            setError(err.message || 'Failed to load help center data');
        } finally {
            setLoading(false);
        }
    }, [fetchCategories, fetchSupportRequests]);

    const submitSupportRequest = useCallback(
        async ({ categoryId, title, description }) => {
            if (!user) {
                throw new Error('You must be signed in to submit a request.');
            }

            setSubmitting(true);
            setError(null);

            try {
                const payload = {
                    user_id: user.id,
                };

                if (categoryId) {
                    payload.category_id = categoryId;
                }

                payload.title = title.trim();
                payload.description = description.trim();

                const { data, error } = await supabase
                    .from('support_requests')
                    .insert([payload])
                    .select(`
                        id,
                        title,
                        description,
                        status,
                        created_at,
                        category:help_categories(name)
                    `)
                    .single();

                if (error) {
                    throw error;
                }

                setSupportRequests((prev) => [
                    formatSupportRequest(data),
                    ...prev,
                ]);

                return { success: true };
            } catch (err) {
                console.error('Failed to submit support request', err);
                setError(err.message || 'Failed to submit support request');
                return { success: false, error: err };
            } finally {
                setSubmitting(false);
            }
        },
        [user]
    );

    useEffect(() => {
        fetchHelpData();
    }, [fetchHelpData]);

    const hasContent = useMemo(
        () => categories.some((category) => category.articles.length > 0),
        [categories]
    );

    return {
        categories,
        supportRequests,
        loading,
        submitting,
        error,
        hasContent,
        refresh: fetchHelpData,
        submitSupportRequest,
    };
};


