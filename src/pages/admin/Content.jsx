import React from 'react';
import { BookOpen, Award, Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Content = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Management</h1>
                    <p className="text-slate-500">Manage courses, badges, and resources.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Courses Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen className="text-primary" size={24} />
                            Courses
                        </h2>
                        <Button variant="outline" size="sm" icon={Plus}>Add Course</Button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: 'Inclusive Design Fundamentals', modules: 8, status: 'Published' },
                            { title: 'SHIFT Methodology', modules: 10, status: 'Published' },
                            { title: 'Assistive Tech Basics', modules: 6, status: 'Draft' },
                        ].map((course, index) => (
                            <Card key={index} className="p-4 flex items-center justify-between" hover>
                                <div>
                                    <h3 className="font-bold text-slate-900">{course.title}</h3>
                                    <p className="text-xs text-slate-500">{course.modules} Modules</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant={course.status === 'Published' ? 'success' : 'warning'}>
                                        {course.status}
                                    </Badge>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" icon={Edit} />
                                        <Button variant="ghost" size="sm" className="text-red-400" icon={Trash2} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Badges Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Award className="text-yellow-400" size={24} />
                            Badges
                        </h2>
                        <Button variant="outline" size="sm" icon={Plus}>Create Badge</Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: 'Early Adopter', icon: '🚀', color: 'bg-blue-500/20 text-blue-400' },
                            { name: 'Design Champion', icon: '🎨', color: 'bg-purple-500/20 text-purple-400' },
                            { name: 'Top Contributor', icon: '⭐', color: 'bg-yellow-500/20 text-yellow-400' },
                            { name: 'Problem Solver', icon: '🧩', color: 'bg-green-500/20 text-green-400' },
                        ].map((badge, index) => (
                            <Card key={index} className="p-4 flex flex-col items-center justify-center text-center gap-2 relative group" hover>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" icon={Edit} className="h-6 w-6 p-0" />
                                </div>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${badge.color}`}>
                                    {badge.icon}
                                </div>
                                <span className="font-bold text-slate-900 text-sm">{badge.name}</span>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Content;
