import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Filter, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useEvents, useRegisterForEvent } from '../../hooks/useEvents';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const Events = () => {
    const [filter, setFilter] = useState('all');
    const { events, loading: eventsLoading, refetch } = useEvents();
    const { register, loading: registering } = useRegisterForEvent();
    const { user } = useAuth();
    const [registeredEvents, setRegisteredEvents] = useState(new Set());
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.id) {
            fetchUserRegistrations();
        }
    }, [user]);

    const fetchUserRegistrations = async () => {
        try {
            const { data, error } = await supabase
                .from('event_registrations')
                .select('event_id')
                .eq('user_id', user.id);

            if (error) throw error;
            if (data) {
                setRegisteredEvents(new Set(data.map(r => r.event_id)));
            }
        } catch (err) {
            console.error('Error fetching registrations:', err);
        }
    };

    const handleRegister = async (eventId) => {
        if (!user) {
            setError('Please log in to register for events');
            return;
        }

        setError('');
        const { data, error: regError } = await register(eventId, user.id);

        if (regError) {
            setError(regError.message || 'Failed to register for event');
        } else {
            setRegisteredEvents(prev => new Set([...prev, eventId]));
            await refetch();
        }
    };

    const getRegistrationCount = async (eventId) => {
        const { count } = await supabase
            .from('event_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', eventId);
        return count || 0;
    };

    const filteredEvents = events.filter(e => {
        if (filter === 'all') return true;
        return e.event_type?.toLowerCase() === filter.toLowerCase();
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    if (eventsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-500">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Events & Opportunities</h1>
                    <p className="text-slate-500">Join workshops, hackathons, and sessions to earn points.</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {['all', 'workshop', 'designathon', 'hackathon', 'meetup'].map((type) => (
                        <Button
                            key={type}
                            variant={filter === type ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(type)}
                            className="capitalize"
                        >
                            {type}
                        </Button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {filteredEvents.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-slate-500">No events found. Check back later!</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => {
                        const isRegistered = registeredEvents.has(event.id);
                        const isFull = event.max_participants && event.max_participants > 0;

                        return (
                            <Card key={event.id} className="p-0 flex flex-col h-full" hover>
                                <div className="h-48 relative">
                                    <img
                                        src={event.image_url || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <Badge variant="neutral" className="bg-black/50 backdrop-blur-md border-transparent capitalize">
                                            {event.event_type}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-3 left-3">
                                        <Badge gradient variant="success" className="text-white border-transparent shadow-lg">
                                            +{event.points || 0} Points
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{event.title}</h3>

                                    <div className="space-y-3 mb-6 flex-1">
                                        <div className="flex items-center gap-3 text-slate-500 text-sm">
                                            <Calendar size={16} className="text-primary" />
                                            <span>{formatDate(event.start_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500 text-sm">
                                            <Clock size={16} className="text-primary" />
                                            <span>{formatTime(event.start_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500 text-sm">
                                            <MapPin size={16} className="text-primary" />
                                            <span>{event.location || 'TBA'}</span>
                                        </div>
                                        {event.max_participants && (
                                            <div className="flex items-center gap-3 text-slate-500 text-sm">
                                                <Users size={16} className="text-primary" />
                                                <span>Max {event.max_participants} participants</span>
                                            </div>
                                        )}
                                    </div>

                                    {isRegistered ? (
                                        <Button variant="outline" className="w-full" disabled icon={CheckCircle}>
                                            Registered
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            className="w-full"
                                            onClick={() => handleRegister(event.id)}
                                            disabled={registering || isFull}
                                        >
                                            {registering ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    Registering...
                                                </>
                                            ) : (
                                                'Register Now'
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Events;
