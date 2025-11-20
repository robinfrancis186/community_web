import React from 'react';
import {
    Zap,
    Target,
    Calendar,
    ArrowRight,
    Trophy,
    Star,
    TrendingUp
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../utils/animations';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../hooks/useEvents';
import { useUserCourses } from '../../hooks/useCourses';
import UpcomingEvents from '../../components/dashboard/UpcomingEvents';

const Dashboard = () => {
    const { user, profile } = useAuth();
    const { events, loading: eventsLoading } = useEvents();
    const { userCourses, loading: coursesLoading } = useUserCourses(user?.id);

    // Calculate user stats from profile
    const userData = {
        name: profile?.full_name || 'User',
        level: profile?.level || 1,
        levelName: profile?.level >= 5 ? 'Expert' : profile?.level >= 3 ? 'Innovator' : 'Beginner',
        xp: profile?.xp || 0,
        nextLevelXp: (profile?.level || 1) * 1000,
        points: profile?.xp || 0,
        rank: 42 // TODO: Calculate from leaderboard
    };

    // Get upcoming events (limit to 2)
    const upcomingEvents = events
        .filter(event => event.status === 'upcoming')
        .slice(0, 2)
        .map(event => ({
            id: event.id,
            title: event.title,
            deadline: new Date(event.start_date).toLocaleDateString(),
            points: 500, // TODO: Add points field to events table
            tags: [event.event_type, event.location].filter(Boolean),
            image: event.image_url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
        }));

    // Calculate stats
    const stats = {
        eventsAttended: 12, // TODO: Count from event_registrations
        badgesEarned: 8, // TODO: Count from badges table
        coursesCompleted: userCourses.filter(uc => uc.completed).length,
        impactHours: Math.floor((profile?.xp || 0) / 100) + 'h'
    };

    const highlights = [
        {
            id: 1,
            user: 'Sarah Lee',
            action: 'earned the "Problem Solver" badge',
            time: '2h ago',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        },
        {
            id: 2,
            user: 'David Chen',
            action: 'completed "Assistive Tech 101"',
            time: '4h ago',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
        }
    ];

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Welcome Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="bg-gradient-to-br from-primary/10 via-purple-50 to-white border-primary/20 shadow-lg">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                    Welcome back, {userData.name}! 👋
                                </h1>
                                <p className="text-slate-700 mb-6">
                                    You're doing great! You've earned <span className="text-transparent bg-clip-text bg-gradient-secondary font-bold">{userData.points} STRIDE Points</span> this month.
                                </p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-900 font-semibold">Level {userData.level}: {userData.levelName}</span>
                                        <span className="text-slate-600">{userData.xp} / {userData.nextLevelXp} XP</span>
                                    </div>
                                    <ProgressBar progress={userData.xp} max={userData.nextLevelXp} color="secondary" />
                                    <p className="text-xs text-slate-500 mt-1">{userData.nextLevelXp - userData.xp} XP to reach Level {userData.level + 1}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="primary" icon={Zap}>
                                    Quick Action
                                </Button>
                                <Button variant="outline" icon={Target}>
                                    View Goals
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="flex flex-col justify-center space-y-4 bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-lg" hover>
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Trophy className="text-amber-500" size={22} />
                            Your Rank
                        </h3>
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600">
                            #{userData.rank}
                            <span className="text-base font-normal text-slate-500 ml-2">Global</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                            <TrendingUp size={16} />
                            <span>Top 5% this week</span>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full justify-between group">
                            View Leaderboard
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Card>
                </motion.div >
            </section >

            {/* Quick Stats Row */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {
                    [
                        { label: 'Events Attended', value: stats.eventsAttended.toString(), icon: Calendar, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
                        { label: 'Badges Earned', value: stats.badgesEarned.toString(), icon: Star, color: 'from-amber-500 to-yellow-500', bgColor: 'bg-amber-50' },
                        { label: 'Courses Completed', value: stats.coursesCompleted.toString(), icon: Target, color: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-50' },
                        { label: 'Impact Hours', value: stats.impactHours, icon: Zap, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
                    ].map((stat, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="p-5 flex items-center gap-4 bg-white border-slate-200" hover>
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                    <div className="text-xs text-slate-600 font-medium">{stat.label}</div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                }
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ongoing Challenges */}
                <section className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Ongoing Challenges</h2>
                        <Button variant="ghost" size="sm">View All</Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {eventsLoading ? (
                            <div className="col-span-2 text-center py-8 text-slate-500">Loading events...</div>
                        ) : upcomingEvents.length === 0 ? (
                            <div className="col-span-2 text-center py-8 text-slate-500">No upcoming events</div>
                        ) : (
                            upcomingEvents.map((challenge) => (
                                <motion.div key={challenge.id} variants={itemVariants}>
                                    <Card className="p-0 group cursor-pointer" hover>
                                        <div className="h-32 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10" />
                                            <img
                                                src={challenge.image}
                                                alt={challenge.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 z-20">
                                                <Badge variant="warning">{challenge.deadline}</Badge>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex gap-2 mb-3">
                                                {challenge.tags.map(tag => (
                                                    <Badge key={tag} variant="neutral">{tag}</Badge>
                                                ))}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                                                {challenge.title}
                                            </h3>
                                            <div className="flex items-center justify-between mt-4">
                                                <span className="text-secondary font-bold text-sm">+{challenge.points} Points</span>
                                                <Button variant="outline" size="sm">Join Now</Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* Right Column */}
                <section className="space-y-8">
                    <UpcomingEvents />

                    {/* Community Highlights */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Community Highlights</h2>
                        </div>

                        <Card className="h-auto">
                            <div className="space-y-6 p-6">
                                {highlights.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <img
                                            src={item.avatar}
                                            alt={item.user}
                                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800"
                                        />
                                        <div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                                <span className="font-bold text-slate-900 dark:text-white">{item.user}</span> {item.action}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                                        Join the conversation in <span className="text-primary cursor-pointer hover:underline">#general</span>
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>
            </div>
        </motion.div >
    );
};

export default Dashboard;
