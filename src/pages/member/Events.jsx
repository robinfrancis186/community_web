import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Events = () => {
    const [filter, setFilter] = useState('all');

    const events = [
        {
            id: 1,
            title: 'Inclusive Design Workshop',
            type: 'Workshop',
            date: 'Nov 25, 2025',
            time: '10:00 AM - 1:00 PM',
            location: 'Main Auditorium',
            mode: 'Offline',
            points: 100,
            image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
            attendees: 45,
            maxAttendees: 60
        },
        {
            id: 2,
            title: 'Assistive Tech Hackathon',
            type: 'Designathon',
            date: 'Dec 01, 2025',
            time: '48 Hours',
            location: 'Online',
            mode: 'Online',
            points: 500,
            image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&w=800&q=80',
            attendees: 120,
            maxAttendees: 200
        },
        {
            id: 3,
            title: 'Accessibility Awareness Session',
            type: 'Session',
            date: 'Nov 28, 2025',
            time: '2:00 PM - 3:30 PM',
            location: 'Zoom',
            mode: 'Online',
            points: 50,
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
            attendees: 85,
            maxAttendees: 100
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Events & Opportunities</h1>
                    <p className="text-slate-500">Join workshops, hackathons, and sessions to earn points.</p>
                </div>

                <div className="flex gap-2">
                    {['all', 'Workshop', 'Designathon', 'Session'].map((type) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events
                    .filter(e => filter === 'all' || e.type === filter)
                    .map((event) => (
                        <Card key={event.id} className="p-0 flex flex-col h-full" hover>
                            <div className="h-48 relative">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <Badge variant="neutral" className="bg-black/50 backdrop-blur-md border-transparent">
                                        {event.type}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <Badge variant="success" className="bg-green-500/90 text-slate-900 border-transparent">
                                        +{event.points} Points
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{event.title}</h3>

                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                                        <Calendar size={16} className="text-primary" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                                        <Clock size={16} className="text-primary" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                                        <MapPin size={16} className="text-primary" />
                                        <span>{event.location} ({event.mode})</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                                        <Users size={16} className="text-primary" />
                                        <span>{event.attendees} / {event.maxAttendees} Registered</span>
                                    </div>
                                </div>

                                <Button variant="primary" className="w-full">
                                    Register Now
                                </Button>
                            </div>
                        </Card>
                    ))}
            </div>
        </div>
    );
};

export default Events;
