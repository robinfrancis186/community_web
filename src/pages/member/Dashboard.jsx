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

const Dashboard = () => {
    // Mock Data
    const user = {
        name: 'Alex Johnson',
        level: 3,
        levelName: 'Innovator',
        xp: 2450,
        nextLevelXp: 3000,
        points: 1250,
        rank: 42
    };

    const challenges = [
        {
            id: 1,
            title: 'Inclusive Design Sprint',
            deadline: '2 days left',
            points: 500,
            tags: ['Design', 'Accessibility'],
            image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 2,
            title: 'Campus Impact Challenge',
            deadline: '5 days left',
            points: 300,
            tags: ['Community', 'Volunteering'],
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
        }
    ];

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
                    <Card className="bg-gradient-to-br from-primary/20 to-surface border-primary/20">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                    Welcome back, {user.name}! 👋
                                </h1>
                                <p className="text-slate-600 mb-6">
                                    You're doing great! You've earned <span className="text-secondary font-bold">{user.points} STRIDE Points</span> this month.
                                </p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-900 font-medium">Level {user.level}: {user.levelName}</span>
                                        <span className="text-slate-500">{user.xp} / {user.nextLevelXp} XP</span>
                                    </div>
                                    <ProgressBar progress={user.xp} max={user.nextLevelXp} color="secondary" />
                                    <p className="text-xs text-slate-500 mt-1">550 XP to reach Level 4 (Collaborator)</p>
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
                    <Card className="flex flex-col justify-center space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Trophy className="text-yellow-400" size={20} />
                            Your Rank
                        </h3>
                        <div className="text-4xl font-bold text-slate-900">
                            #{user.rank}
                            <span className="text-base font-normal text-slate-500 ml-2">Global</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400 text-sm">
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
            < section className="grid grid-cols-2 md:grid-cols-4 gap-4" >
                {
                    [
                        { label: 'Events Attended', value: '12', icon: Calendar, color: 'text-blue-400' },
                        { label: 'Badges Earned', value: '8', icon: Star, color: 'text-yellow-400' },
                        { label: 'Courses Completed', value: '3', icon: Target, color: 'text-green-400' },
                        { label: 'Impact Hours', value: '24h', icon: Zap, color: 'text-purple-400' },
                    ].map((stat, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="p-4 flex items-center gap-4" hover>
                                <div className={`p-3 rounded-xl bg-slate-100 ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                    <div className="text-xs text-slate-500">{stat.label}</div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                }
            </section >

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ongoing Challenges */}
                <section className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Ongoing Challenges</h2>
                        <Button variant="ghost" size="sm">View All</Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {challenges.map((challenge) => (
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
                        ))}
                    </div>
                </section>

                {/* Community Highlights */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Community Highlights</h2>
                    </div>

                    <Card className="h-full">
                        <div className="space-y-6">
                            {highlights.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <img
                                        src={item.avatar}
                                        alt={item.user}
                                        className="w-10 h-10 rounded-full bg-slate-100"
                                    />
                                    <div>
                                        <p className="text-sm text-slate-600">
                                            <span className="font-bold text-slate-900">{item.user}</span> {item.action}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-slate-200">
                                <p className="text-center text-sm text-slate-500">
                                    Join the conversation in <span className="text-primary cursor-pointer hover:underline">#general</span>
                                </p>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>
        </motion.div >
    );
};

export default Dashboard;
