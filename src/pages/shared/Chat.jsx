import React from 'react';
import { MessageSquare, Hash, Users, Send } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Chat = () => {
    const channels = [
        { id: 1, name: 'general', type: 'public' },
        { id: 2, name: 'announcements', type: 'public' },
        { id: 3, name: 'design-help', type: 'public' },
        { id: 4, name: 'random', type: 'public' },
    ];

    const messages = [
        { id: 1, user: 'Sarah Lee', content: 'Has anyone started the new design challenge?', time: '10:30 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
        { id: 2, user: 'David Chen', content: 'Yes! The prompt is really interesting this time.', time: '10:32 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
        { id: 3, user: 'Alex Johnson', content: 'I need a team member for the UI part. Anyone interested?', time: '10:35 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Sidebar */}
            <Card className="w-64 flex flex-col p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare size={20} className="text-primary" />
                        Community
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    <p className="px-2 py-1 text-xs font-bold text-slate-500 uppercase">Channels</p>
                    {channels.map((channel) => (
                        <button
                            key={channel.id}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                        >
                            <Hash size={16} />
                            <span>{channel.name}</span>
                        </button>
                    ))}

                    <p className="px-2 py-1 text-xs font-bold text-slate-500 uppercase mt-4">Direct Messages</p>
                    {[1, 2, 3].map((i) => (
                        <button
                            key={i}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>User {i}</span>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Hash size={20} className="text-slate-500" />
                        <h3 className="font-bold text-slate-900">general</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Users size={16} />
                        <span>1,240 Members</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className="flex gap-4 group">
                            <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full bg-slate-200" />
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-slate-900 hover:underline cursor-pointer">{msg.user}</span>
                                    <span className="text-xs text-slate-500">{msg.time}</span>
                                </div>
                                <p className="text-slate-600">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-200">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Message #general"
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-primary transition-colors">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Chat;
