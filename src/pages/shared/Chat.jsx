import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Hash, Users, Send, Plus, Search, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';

const Chat = () => {
    const { user } = useAuth();
    const {
        channels,
        dms,
        activeChannel,
        setActiveChannel,
        messages,
        sendMessage,
        users,
        createDm
    } = useChat();

    const [newMessage, setNewMessage] = useState('');
    const [showUserSearch, setShowUserSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage(newMessage);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const handleStartDm = async (otherUserId) => {
        try {
            const channelId = await createDm(otherUserId);
            setShowUserSearch(false);
            // Optionally find and set active channel here, or let the user click it from the list
            // For better UX, we should probably auto-select it.
            // Since fetchDms is called in createDm, the new channel should be in the list soon.
        } catch (error) {
            console.error('Failed to start DM', error);
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 relative">
            {/* Sidebar */}
            <Card className="w-64 flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquare size={20} className="text-primary" />
                        Community
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    <p className="px-2 py-1 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Channels</p>
                    {channels.map((channel) => (
                        <button
                            key={channel.id}
                            onClick={() => setActiveChannel(channel)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${activeChannel?.id === channel.id
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Hash size={16} />
                            <span className="truncate">{channel.name}</span>
                        </button>
                    ))}

                    <div className="flex items-center justify-between px-2 mt-6 mb-1">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Direct Messages</p>
                        <button
                            onClick={() => setShowUserSearch(true)}
                            className="text-slate-400 hover:text-primary transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {dms.length === 0 && (
                        <p className="px-2 text-xs text-slate-400 italic">No conversations yet</p>
                    )}

                    {dms.map((dm) => (
                        <button
                            key={dm.id}
                            onClick={() => setActiveChannel(dm)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${activeChannel?.id === dm.id
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <div className="relative">
                                <img
                                    src={dm.otherUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dm.otherUser?.full_name || 'User'}`}
                                    alt={dm.otherUser?.full_name}
                                    className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 object-cover"
                                />
                                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-slate-800"></div>
                            </div>
                            <span className="truncate text-sm">{dm.otherUser?.full_name || 'Unknown User'}</span>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                {activeChannel ? (
                    <>
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                {activeChannel.type === 'public' ? (
                                    <Hash size={20} className="text-slate-500 dark:text-slate-400" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                )}
                                <h3 className="font-bold text-slate-900 dark:text-white">
                                    {activeChannel.type === 'public'
                                        ? activeChannel.name
                                        : activeChannel.otherUser?.full_name || 'Direct Message'}
                                </h3>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-slate-900/50">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <MessageSquare size={48} className="mb-2 opacity-20" />
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.user_id === user.id;
                                    return (
                                        <div key={msg.id} className={`flex gap-4 group ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <img
                                                src={msg.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.profiles?.full_name || 'User'}`}
                                                alt={msg.profiles?.full_name}
                                                className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 object-cover flex-shrink-0"
                                            />
                                            <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="font-bold text-slate-900 dark:text-white text-sm">{msg.profiles?.full_name || 'User'}</span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className={`p-3 rounded-2xl text-sm ${isMe
                                                        ? 'bg-primary text-white rounded-tr-none'
                                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-none shadow-sm'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={`Message ${activeChannel.type === 'public' ? '#' + activeChannel.name : activeChannel.otherUser?.full_name || '...'}`}
                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-primary disabled:opacity-50 disabled:hover:text-slate-500 transition-colors"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <p>Select a channel to start chatting</p>
                    </div>
                )}
            </Card>

            {/* User Search Modal */}
            {showUserSearch && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white">New Message</h3>
                            <button onClick={() => setShowUserSearch(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto bg-white dark:bg-slate-800">
                            {filteredUsers.map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => handleStartDm(u.id)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-b border-slate-100 dark:border-slate-700 last:border-0"
                                >
                                    <img
                                        src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.full_name}`}
                                        alt={u.full_name}
                                        className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 object-cover"
                                    />
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{u.full_name}</p>
                                        <p className="text-xs text-slate-500 capitalize">{u.role}</p>
                                    </div>
                                </button>
                            ))}
                            {filteredUsers.length === 0 && (
                                <div className="p-8 text-center text-slate-500">
                                    No users found
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Chat;
