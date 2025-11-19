import React from 'react';
import { BookOpen, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';

const Courses = () => {
    const courses = [
        {
            id: 1,
            title: 'Inclusive Design Fundamentals',
            description: 'Learn the core principles of designing for everyone.',
            progress: 75,
            totalModules: 8,
            completedModules: 6,
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
            tags: ['Design', 'Core'],
            status: 'in-progress'
        },
        {
            id: 2,
            title: 'SHIFT Methodology',
            description: 'Master the SHIFT framework for innovation.',
            progress: 30,
            totalModules: 10,
            completedModules: 3,
            image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
            tags: ['Methodology', 'Advanced'],
            status: 'in-progress'
        },
        {
            id: 3,
            title: 'Assistive Technology Basics',
            description: 'Introduction to hardware and software for accessibility.',
            progress: 0,
            totalModules: 6,
            completedModules: 0,
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
            tags: ['Tech', 'Hardware'],
            status: 'locked'
        },
        {
            id: 4,
            title: 'Disability Sensitization',
            description: 'Understanding different types of disabilities.',
            progress: 100,
            totalModules: 5,
            completedModules: 5,
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
            tags: ['Social', 'Core'],
            status: 'completed'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Learning Tracks</h1>
                <p className="text-gray-400">Master new skills and earn certificates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                    <Card key={course.id} className="p-0 flex flex-col md:flex-row overflow-hidden h-full md:h-48" hover>
                        <div className="w-full md:w-48 h-48 md:h-full relative shrink-0">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                            {course.status === 'completed' && (
                                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                    <div className="bg-green-500 rounded-full p-2">
                                        <CheckCircle className="text-white" size={24} />
                                    </div>
                                </div>
                            )}
                            {course.status === 'locked' && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Lock className="text-gray-400" size={24} />
                                </div>
                            )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex gap-2 mb-2">
                                    {course.tags.map(tag => (
                                        <Badge key={tag} variant="neutral">{tag}</Badge>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2">{course.description}</p>
                            </div>

                            <div className="mt-4 space-y-3">
                                {course.status !== 'locked' ? (
                                    <>
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>{course.completedModules} / {course.totalModules} Modules</span>
                                            <span>{course.progress}%</span>
                                        </div>
                                        <ProgressBar
                                            progress={course.progress}
                                            color={course.status === 'completed' ? 'success' : 'primary'}
                                            className="h-1.5"
                                        />
                                        <Button
                                            variant={course.status === 'completed' ? 'outline' : 'primary'}
                                            size="sm"
                                            className="w-full mt-2"
                                            icon={course.status === 'completed' ? CheckCircle : PlayCircle}
                                        >
                                            {course.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="ghost" size="sm" className="w-full mt-2 cursor-not-allowed" disabled>
                                        Locked (Level 4 Required)
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Courses;
