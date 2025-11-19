import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Users, Edit, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useEvents, useCreateEvent } from '../../hooks/useEvents';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const Events = () => {
    const { events, loading: eventsLoading, refetch } = useEvents();
    const { createEvent, loading: creating } = useCreateEvent();
    const { profile } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [error, setError] = useState('');
    const [campuses, setCampuses] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_type: 'workshop',
        start_date: '',
        end_date: '',
        location: '',
        campus_id: profile?.campus_id || '',
        max_participants: '',
        image_url: '',
        points: 100,
        xp_reward: 50,
        status: 'upcoming'
    });

    useEffect(() => {
        fetchCampuses();
    }, []);

    const fetchCampuses = async () => {
        try {
            const { data } = await supabase
                .from('campuses')
                .select('id, name')
                .order('name');
            setCampuses(data || []);
        } catch (err) {
            console.error('Error fetching campuses:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'max_participants' || name === 'points' || name === 'xp_reward' 
                ? (value === '' ? '' : parseInt(value)) 
                : value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const eventData = {
                ...formData,
                created_by: profile?.id,
                max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
                points: formData.points || 0,
                xp_reward: formData.xp_reward || 0,
                campus_id: formData.campus_id || null
            };

            const { data, error: createError } = await createEvent(eventData);

            if (createError) throw createError;

            setShowCreateModal(false);
            setEditingEvent(null);
            resetForm();
            await refetch();
        } catch (err) {
            setError(err.message || 'Failed to create event');
        }
    };

    const handleDelete = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', eventId);

            if (error) throw error;
            await refetch();
        } catch (err) {
            setError(err.message || 'Failed to delete event');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            event_type: 'workshop',
            start_date: '',
            end_date: '',
            location: '',
            campus_id: profile?.campus_id || '',
            max_participants: '',
            image_url: '',
            points: 100,
            xp_reward: 50,
            status: 'upcoming'
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getRegistrationCount = async (eventId) => {
        const { count } = await supabase
            .from('event_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', eventId);
        return count || 0;
    };

    const campusEvents = events.filter(e => e.campus_id === profile?.campus_id || !profile?.campus_id);

    if (eventsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Event Management</h1>
                    <p className="text-slate-500">Create and manage campus events.</p>
                </div>
                <Button variant="primary" icon={Plus} onClick={() => setShowCreateModal(true)}>
                    Create Event
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {campusEvents.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-slate-500">No events created yet. Create your first event!</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {campusEvents.map((event) => (
                        <Card key={event.id} className="p-0 flex flex-col" hover>
                            <div className="h-48 relative">
                                <img
                                    src={event.image_url || 'https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&w=800&q=80'}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <Badge variant={event.status === 'upcoming' ? 'success' : 'neutral'} className="capitalize">
                                        {event.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{event.title}</h3>

                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                                        <Calendar size={16} className="text-primary" />
                                        <span>{formatDate(event.start_date)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                                        <MapPin size={16} className="text-primary" />
                                        <span>{event.location || 'TBA'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                                        <Users size={16} className="text-primary" />
                                        <span>{event.max_participants ? `Max ${event.max_participants} participants` : 'Unlimited'}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-200">
                                    <Button variant="outline" size="sm" className="flex-1" icon={Edit}>
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-red-400 hover:bg-red-500/10" 
                                        icon={Trash2}
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Create New Event</h2>
                            <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-slate-500 hover:text-slate-900">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Event Type *</label>
                                    <select
                                        name="event_type"
                                        value={formData.event_type}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="workshop">Workshop</option>
                                        <option value="designathon">Designathon</option>
                                        <option value="hackathon">Hackathon</option>
                                        <option value="meetup">Meetup</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Date *</label>
                                    <input
                                        type="datetime-local"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                                    <input
                                        type="datetime-local"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Max Participants</label>
                                    <input
                                        type="number"
                                        name="max_participants"
                                        value={formData.max_participants}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Points</label>
                                    <input
                                        type="number"
                                        name="points"
                                        value={formData.points}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">XP Reward</label>
                                    <input
                                        type="number"
                                        name="xp_reward"
                                        value={formData.xp_reward}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setShowCreateModal(false); resetForm(); }}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={creating}
                                    className="flex-1"
                                    icon={creating ? Loader2 : Plus}
                                >
                                    {creating ? 'Creating...' : 'Create Event'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Events;
