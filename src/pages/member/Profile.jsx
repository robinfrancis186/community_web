import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Save, Loader2, AlertCircle, CheckCircle, Linkedin, Twitter, Github, Globe } from 'lucide-react';
import AvatarUpload from '../../components/profile/AvatarUpload';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const Profile = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // General Form Data
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        campus_id: '',
        avatar_url: '',
        social_links: {
            linkedin: '',
            twitter: '',
            github: '',
            website: ''
        }
    });

    // Password Form Data
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [campuses, setCampuses] = useState([]);

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                email: profile.email || '',
                campus_id: profile.campus_id || '',
                avatar_url: profile.avatar_url || '',
                social_links: {
                    linkedin: profile.social_links?.linkedin || '',
                    twitter: profile.social_links?.twitter || '',
                    github: profile.social_links?.github || '',
                    website: profile.social_links?.website || ''
                }
            });
        }
        fetchCampuses();
    }, [profile]);

    const fetchCampuses = async () => {
        try {
            const { data, error } = await supabase
                .from('campuses')
                .select('id, name')
                .order('name');

            if (error) throw error;
            setCampuses(data || []);
        } catch (err) {
            console.error('Error fetching campuses:', err);
        }
    };

    const handleGeneralChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setMessage({ type: '', text: '' });
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [name]: value
            }
        }));
        setMessage({ type: '', text: '' });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        setMessage({ type: '', text: '' });
    };

    const handleAvatarUpload = async (url) => {
        // Update local state immediately
        setFormData(prev => ({ ...prev, avatar_url: url }));

        // Auto-save the avatar update
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    avatar_url: url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profile picture updated!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile picture' });
        }
    };

    const handleGeneralSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    campus_id: formData.campus_id || null,
                    social_links: formData.social_links,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update password' });
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Account Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your profile and security preferences.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'general'
                        ? 'text-primary'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    General Profile
                    {activeTab === 'general' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'security'
                        ? 'text-primary'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    Security
                    {activeTab === 'security' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                    )}
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            {activeTab === 'general' ? (
                <Card className="p-6 space-y-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-200 dark:border-slate-700">
                        <AvatarUpload
                            url={formData.avatar_url}
                            onUpload={handleAvatarUpload}
                            size={120}
                        />
                        <div className="text-center sm:text-left">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Picture</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">
                                Upload a new avatar or use a URL. Recommended size: 400x400px.
                            </p>
                        </div>
                    </div>

                    {/* General Form */}
                    <form onSubmit={handleGeneralSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleGeneralChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Campus
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select
                                        name="campus_id"
                                        value={formData.campus_id}
                                        onChange={handleGeneralChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none"
                                    >
                                        <option value="">Select a campus</option>
                                        {campuses.map(campus => (
                                            <option key={campus.id} value={campus.id}>
                                                {campus.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Social Links</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        LinkedIn URL
                                    </label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="url"
                                            name="linkedin"
                                            value={formData.social_links.linkedin}
                                            onChange={handleSocialChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Twitter URL
                                    </label>
                                    <div className="relative">
                                        <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="url"
                                            name="twitter"
                                            value={formData.social_links.twitter}
                                            onChange={handleSocialChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                            placeholder="https://twitter.com/..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        GitHub URL
                                    </label>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="url"
                                            name="github"
                                            value={formData.social_links.github}
                                            onChange={handleSocialChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Website / Portfolio
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.social_links.website}
                                            onChange={handleSocialChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={saving}
                                icon={saving ? Loader2 : Save}
                            >
                                {saving ? 'Saving Changes...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Card>
            ) : (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Change Password</h3>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={saving}
                                icon={saving ? Loader2 : Save}
                            >
                                {saving ? 'Updating Password...' : 'Update Password'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

export default Profile;

