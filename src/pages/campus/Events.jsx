import React from 'react';
import { Plus, Calendar, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Events = () => {
    const events = [
        {
            id: 1,
            title: 'Campus Hackathon 2025',
            date: 'Nov 25, 2025',
            location: 'Main Auditorium',
            registrations: 45,
            status: 'Upcoming',
            image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 2,
            title: 'Design Thinking Workshop',
            date: 'Dec 01, 2025',
            location: 'Seminar Hall',
            registrations: 28,
            status: 'Draft',
            image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Event Management</h1>
                    <p className="text-slate-500">Create and manage campus events.</p>
                </div>
                <Button variant="primary" icon={Plus}>Create Event</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                    <Card key={event.id} className="p-0 flex flex-col" hover>
                        <div className="h-48 relative">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3">
                                <Badge variant={event.status === 'Upcoming' ? 'success' : 'neutral'}>
                                    {event.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{event.title}</h3>

                            <div className="space-y-3 mb-6 flex-1">
                                <div className="flex items-center gap-3 text-slate-500 text-sm">
                                    <Calendar size={16} className="text-primary" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-sm">
                                    <MapPin size={16} className="text-primary" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-sm">
                                    <Users size={16} className="text-primary" />
                                    <span>{event.registrations} Registered</span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <Button variant="outline" size="sm" className="flex-1" icon={Edit}>
                                    Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10" icon={Trash2}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Events;
