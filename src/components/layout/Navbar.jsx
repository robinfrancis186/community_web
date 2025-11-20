import { useEffect, useState } from 'react';
import { Bell, Search, Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';

const Navbar = () => {
    const { profile, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [avatarUrl, setAvatarUrl] = useState('');

    // Get display name and role from profile
    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
    const displayRole = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Member';
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

    useEffect(() => {
        if (!profile?.avatar_url) {
            setAvatarUrl(defaultAvatar);
            return;
        }

        if (profile.avatar_url.startsWith('http')) {
            setAvatarUrl(profile.avatar_url);
            return;
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(profile.avatar_url);
        if (data?.publicUrl) {
            setAvatarUrl(data.publicUrl);
        } else {
            setAvatarUrl(defaultAvatar);
        }
    }, [profile?.avatar_url, defaultAvatar]);

    return (
        <header className="h-16 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-6 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button className="lg:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <Menu size={24} />
                </button>

                {/* Logo */}
                <div className="flex items-center gap-2 mr-4">
                    <img src="/src/assets/stride-logo.png" alt="STRIDE" className="h-10 w-auto md:h-12" />
                    <span className="hidden md:block text-xl font-bold text-slate-900 dark:text-white tracking-tight">STRIDE</span>
                </div>

                <div className="relative hidden md:block">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-colors duration-300 shadow-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-slate-900">{displayName}</p>
                        <p className="text-xs text-slate-500">{displayRole}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px]">
                        <div className="w-full h-full rounded-full bg-surface border-2 border-transparent overflow-hidden">
                            <img
                                src={avatarUrl || defaultAvatar}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
