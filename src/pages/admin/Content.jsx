import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Plus, Edit, Trash2, Loader2, X, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';

const Content = () => {
    const [courses, setCourses] = useState([]);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [error, setError] = useState('');
    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: 'beginner',
        duration_hours: '',
        thumbnail_url: ''
    });
    const [badgeForm, setBadgeForm] = useState({
        name: '',
        description: '',
        icon: '',
        color: '',
        xp_reward: 0
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const [coursesRes, badgesRes] = await Promise.all([
                supabase.from('courses').select('*').order('created_at', { ascending: false }),
                supabase.from('badges').select('*').order('created_at', { ascending: false })
            ]);

            if (coursesRes.error) throw coursesRes.error;
            if (badgesRes.error) throw badgesRes.error;

            setCourses(coursesRes.data || []);
            setBadges(badgesRes.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch content');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('courses')
                .insert([{
                    ...courseForm,
                    duration_hours: courseForm.duration_hours ? parseInt(courseForm.duration_hours) : null
                }]);

            if (error) throw error;
            setShowCourseModal(false);
            setCourseForm({ title: '', description: '', category: '', difficulty: 'beginner', duration_hours: '', thumbnail_url: '' });
            await fetchContent();
        } catch (err) {
            setError(err.message || 'Failed to create course');
        }
    };

    const handleCreateBadge = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('badges')
                .insert([badgeForm]);

            if (error) throw error;
            setShowBadgeModal(false);
            setBadgeForm({ name: '', description: '', icon: '', color: '', xp_reward: 0 });
            await fetchContent();
        } catch (err) {
            setError(err.message || 'Failed to create badge');
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            const { error } = await supabase.from('courses').delete().eq('id', id);
            if (error) throw error;
            await fetchContent();
        } catch (err) {
            setError(err.message || 'Failed to delete course');
        }
    };

    const handleDeleteBadge = async (id) => {
        if (!confirm('Are you sure you want to delete this badge?')) return;
        try {
            const { error } = await supabase.from('badges').delete().eq('id', id);
            if (error) throw error;
            await fetchContent();
        } catch (err) {
            setError(err.message || 'Failed to delete badge');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Management</h1>
                    <p className="text-slate-500">Manage courses, badges, and resources.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Courses Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen className="text-primary" size={24} />
                            Courses
                        </h2>
                        <Button variant="outline" size="sm" icon={Plus} onClick={() => setShowCourseModal(true)}>
                            Add Course
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {courses.length === 0 ? (
                            <Card className="p-8 text-center text-slate-500">
                                No courses yet
                            </Card>
                        ) : (
                            courses.map((course) => (
                                <Card key={course.id} className="p-4 flex items-center justify-between" hover>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{course.title}</h3>
                                        <p className="text-xs text-slate-500">{course.category || 'Uncategorized'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="success">Published</Badge>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" icon={Edit} />
                                            <Button variant="ghost" size="sm" className="text-red-400" icon={Trash2} onClick={() => handleDeleteCourse(course.id)} />
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </section>

                {/* Badges Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Award className="text-yellow-400" size={24} />
                            Badges
                        </h2>
                        <Button variant="outline" size="sm" icon={Plus} onClick={() => setShowBadgeModal(true)}>
                            Create Badge
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {badges.length === 0 ? (
                            <Card className="p-8 text-center text-slate-500 col-span-2">
                                No badges yet
                            </Card>
                        ) : (
                            badges.map((badge) => (
                                <Card key={badge.id} className="p-4 flex flex-col items-center justify-center text-center gap-2 relative group" hover>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={Trash2}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-400"
                                        onClick={() => handleDeleteBadge(badge.id)}
                                    />
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${badge.color || 'bg-blue-500/20 text-blue-400'}`}>
                                        {badge.icon || '🏆'}
                                    </div>
                                    <span className="font-bold text-slate-900 text-sm">{badge.name}</span>
                                </Card>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* Course Modal */}
            {showCourseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Create Course</h2>
                            <button onClick={() => setShowCourseModal(false)} className="text-slate-500 hover:text-slate-900">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <input type="text" placeholder="Title *" value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                            <textarea placeholder="Description" value={courseForm.description} onChange={(e) => setCourseForm({...courseForm, description: e.target.value})} rows={3} className="w-full px-4 py-2 border rounded-lg" />
                            <input type="text" placeholder="Category" value={courseForm.category} onChange={(e) => setCourseForm({...courseForm, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                            <select value={courseForm.difficulty} onChange={(e) => setCourseForm({...courseForm, difficulty: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <input type="number" placeholder="Duration (hours)" value={courseForm.duration_hours} onChange={(e) => setCourseForm({...courseForm, duration_hours: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                            <input type="url" placeholder="Thumbnail URL" value={courseForm.thumbnail_url} onChange={(e) => setCourseForm({...courseForm, thumbnail_url: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setShowCourseModal(false)} className="flex-1">Cancel</Button>
                                <Button type="submit" variant="primary" className="flex-1">Create</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Badge Modal */}
            {showBadgeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Create Badge</h2>
                            <button onClick={() => setShowBadgeModal(false)} className="text-slate-500 hover:text-slate-900">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateBadge} className="space-y-4">
                            <input type="text" placeholder="Name *" value={badgeForm.name} onChange={(e) => setBadgeForm({...badgeForm, name: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                            <textarea placeholder="Description" value={badgeForm.description} onChange={(e) => setBadgeForm({...badgeForm, description: e.target.value})} rows={2} className="w-full px-4 py-2 border rounded-lg" />
                            <input type="text" placeholder="Icon (emoji)" value={badgeForm.icon} onChange={(e) => setBadgeForm({...badgeForm, icon: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                            <input type="text" placeholder="Color (CSS class)" value={badgeForm.color} onChange={(e) => setBadgeForm({...badgeForm, color: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                            <input type="number" placeholder="XP Reward" value={badgeForm.xp_reward} onChange={(e) => setBadgeForm({...badgeForm, xp_reward: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" />
                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setShowBadgeModal(false)} className="flex-1">Cancel</Button>
                                <Button type="submit" variant="primary" className="flex-1">Create</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Content;
