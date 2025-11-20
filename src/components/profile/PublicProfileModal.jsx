import React, { useEffect, useState } from 'react';
import { X, MapPin, Mail, Linkedin, Twitter, Github, Globe, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const PublicProfileModal = ({ userId, isOpen, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && userId) {
            fetchProfile();
        } else {
            setProfile(null);
        }
    }, [isOpen, userId]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    *,
                    campus:campuses(name)
                `)
                .eq('id', userId)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = () => {
        // Navigate to chat with this user
        // We'll assume Chat.jsx can handle a query param or state to open a DM
        // For now, just go to chat
        onClose();
        navigate('/member/chat');
        // Ideally, we'd pass the userId to open the DM immediately.
        // This might require updating Chat.jsx to read location state or query params.
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header / Cover */}
                <div className="h-32 bg-gradient-to-r from-primary to-secondary relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 pb-6">
                    {/* Avatar */}
                    <div className="relative -mt-16 mb-4 flex justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden shadow-lg">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url.startsWith('http')
                                        ? profile.avatar_url
                                        : supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl}
                                    alt={profile.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-slate-400">
                                        {profile?.full_name?.charAt(0) || '?'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : profile ? (
                        <div className="text-center space-y-6">
                            {/* Basic Info */}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {profile.full_name}
                                </h2>
                                <p className="text-primary font-medium capitalize mt-1">
                                    {profile.role || 'Member'}
                                </p>
                                {profile.campus?.name && (
                                    <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 mt-2 text-sm">
                                        <MapPin size={16} />
                                        <span>{profile.campus.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-center">
                                <Button onClick={handleMessage} icon={MessageSquare}>
                                    Send Message
                                </Button>
                            </div>

                            {/* Social Links */}
                            {profile.social_links && Object.values(profile.social_links).some(link => link) && (
                                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                                        Connect
                                    </h3>
                                    <div className="flex justify-center gap-4">
                                        {profile.social_links.linkedin && (
                                            <a
                                                href={profile.social_links.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-slate-500 hover:text-[#0077b5] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                                            >
                                                <Linkedin size={24} />
                                            </a>
                                        )}
                                        {profile.social_links.twitter && (
                                            <a
                                                href={profile.social_links.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-slate-500 hover:text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                                            >
                                                <Twitter size={24} />
                                            </a>
                                        )}
                                        {profile.social_links.github && (
                                            <a
                                                href={profile.social_links.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                                            >
                                                <Github size={24} />
                                            </a>
                                        )}
                                        {profile.social_links.website && (
                                            <a
                                                href={profile.social_links.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                                            >
                                                <Globe size={24} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 py-8">
                            User not found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicProfileModal;
