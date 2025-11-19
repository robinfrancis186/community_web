import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, CheckCircle, Lock, Loader2, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { useCourses, useUserCourses, useEnrollCourse } from '../../hooks/useCourses';
import { useAuth } from '../../contexts/AuthContext';

const Courses = () => {
    const { courses, loading: coursesLoading, refetch: refetchCourses } = useCourses();
    const { user } = useAuth();
    const { userCourses, loading: userCoursesLoading } = useUserCourses(user?.id);
    const { enroll, loading: enrolling } = useEnrollCourse();
    const [error, setError] = useState('');

    const getUserCourse = (courseId) => {
        return userCourses.find(uc => uc.course_id === courseId);
    };

    const handleEnroll = async (courseId) => {
        if (!user) {
            setError('Please log in to enroll in courses');
            return;
        }

        setError('');
        const { data, error: enrollError } = await enroll(courseId, user.id);

        if (enrollError) {
            setError(enrollError.message || 'Failed to enroll in course');
        } else {
            await refetchCourses();
        }
    };

    if (coursesLoading || userCoursesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-500">Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Tracks</h1>
                <p className="text-slate-500">Master new skills and earn certificates.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {courses.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-slate-500">No courses available. Check back later!</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course) => {
                        const userCourse = getUserCourse(course.id);
                        const isEnrolled = !!userCourse;
                        const progress = userCourse?.progress || 0;
                        const completed = userCourse?.completed || false;
                        const status = completed ? 'completed' : isEnrolled ? 'in-progress' : 'not-enrolled';

                        return (
                            <Card key={course.id} className="p-0 flex flex-col md:flex-row overflow-hidden h-full md:h-48" hover>
                                <div className="w-full md:w-48 h-48 md:h-full relative shrink-0">
                                    <img
                                        src={course.thumbnail_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {completed && (
                                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                            <div className="bg-green-500 rounded-full p-2">
                                                <CheckCircle className="text-slate-900" size={24} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            {course.category && (
                                                <Badge variant="neutral">{course.category}</Badge>
                                            )}
                                            {course.difficulty && (
                                                <Badge variant="secondary" className="capitalize">{course.difficulty}</Badge>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{course.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2">{course.description || 'No description available'}</p>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {isEnrolled ? (
                                            <>
                                                <div className="flex justify-between text-xs text-slate-500">
                                                    <span>Progress</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <ProgressBar
                                                    progress={progress}
                                                    color={completed ? 'success' : 'primary'}
                                                    className="h-1.5"
                                                />
                                                <Button
                                                    variant={completed ? 'outline' : 'primary'}
                                                    size="sm"
                                                    className="w-full mt-2"
                                                    icon={completed ? CheckCircle : PlayCircle}
                                                >
                                                    {completed ? 'Review Course' : 'Continue Learning'}
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="w-full mt-2"
                                                onClick={() => handleEnroll(course.id)}
                                                disabled={enrolling}
                                                icon={enrolling ? Loader2 : BookOpen}
                                            >
                                                {enrolling ? 'Enrolling...' : 'Enroll Now'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Courses;
