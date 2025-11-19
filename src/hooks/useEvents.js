import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('start_date', { ascending: true });

            if (error) throw error;
            setEvents(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { events, loading, error, refetch: fetchEvents };
};

export const useEventById = (id) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchEvent = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setEvent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    return { event, loading, error };
};

export const useCreateEvent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createEvent = async (eventData) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('events')
                .insert([eventData])
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

    return { createEvent, loading, error };
};

export const useRegisterForEvent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (eventId, userId) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('event_registrations')
                .insert([{ event_id: eventId, user_id: userId }])
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

    return { register, loading, error };
};
