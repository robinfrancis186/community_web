import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .gt('start_date', new Date().toISOString())
                .order('start_date', { ascending: true })
                .limit(3);

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Events</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse flex gap-4">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Events</h3>
                <Link to="/member/events" className="text-sm text-primary hover:text-primary-600 font-medium flex items-center gap-1">
                    View All <ArrowRight size={16} />
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 py-8">
                    <Calendar size={48} className="mb-3 opacity-20" />
                    <p>No upcoming events scheduled.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map((event) => {
                        const date = new Date(event.start_date);
                        return (
                            <div key={event.id} className="flex gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors -mx-2">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center text-primary">
                                    <span className="text-xs font-bold uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {event.location && (
                                            <span className="flex items-center gap-1 truncate">
                                                <MapPin size={12} />
                                                {event.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default UpcomingEvents;
