import React from 'react';
import { Lightbulb, Search, Filter, ThumbsUp, MessageCircle, Share2, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Innovations = () => {
    const projects = [
        {
            id: 1,
            title: 'Smart Cane for Visually Impaired',
            author: 'Team Vision',
            category: 'Assistive Tech',
            likes: 124,
            comments: 45,
            image: 'https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&w=800&q=80',
            status: 'Prototype'
        },
        {
            id: 2,
            title: 'Eco-Friendly Water Filter',
            author: 'Green Earth',
            category: 'Sustainability',
            likes: 89,
            comments: 23,
            image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=80',
            status: 'Idea'
        },
        {
            id: 3,
            title: 'Accessible Learning App',
            author: 'Code for Good',
            category: 'Education',
            likes: 156,
            comments: 67,
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
            status: 'Live'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Innovation Repository</h1>
                    <p className="text-gray-400">Explore and share innovative projects from the community.</p>
                </div>
                <Button variant="primary" icon={Plus}>Submit Project</Button>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
                        />
                    </div>
                    <Button variant="outline" icon={Filter}>Filters</Button>
                </div>
            </Card>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card key={project.id} className="p-0 flex flex-col" hover>
                        <div className="h-48 relative">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3">
                                <Badge variant="neutral">{project.status}</Badge>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-4">
                                <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                                <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                                <p className="text-sm text-gray-400">by {project.author}</p>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="flex gap-4 text-gray-400 text-sm">
                                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                        <ThumbsUp size={16} />
                                        <span>{project.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                        <MessageCircle size={16} />
                                        <span>{project.comments}</span>
                                    </button>
                                </div>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Innovations;
