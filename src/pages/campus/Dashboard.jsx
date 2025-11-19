import React from 'react';
import { Users, Calendar, TrendingUp, Award, Activity } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Dashboard = () => {
    const stats = [
        { label: 'Total Members', value: '1,240', icon: Users, color: 'text-blue-400', change: '+12%' },
        { label: 'Impact Score', value: '850', icon: Activity, color: 'text-green-400', change: '+5%' },
        { label: 'Events Hosted', value: '24', icon: Calendar, color: 'text-purple-400', change: '+2' },
        { label: 'Certificates Issued', value: '156', icon: Award, color: 'text-yellow-400', change: '+18%' },
    ];

    const recentActivity = [
        { user: 'Sarah Lee', action: 'registered for', target: 'Inclusive Design Workshop', time: '10m ago' },
        { user: 'David Chen', action: 'submitted', target: 'Designathon Project', time: '1h ago' },
        { user: 'Alex Johnson', action: 'completed', target: 'Accessibility Quiz', time: '2h ago' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Campus Dashboard</h1>
                    <p className="text-slate-500">Overview of GEC Barton Hill's performance.</p>
                </div>
                <Button variant="primary" icon={Calendar}>Create Event</Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-6" hover>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-slate-100 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <Badge variant="success">{stat.change}</Badge>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-500">{stat.label}</div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Impact Chart Placeholder */}
                <Card className="lg:col-span-2 min-h-[300px] flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Impact Growth</h3>
                    <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
                        {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                            <div key={i} className="w-full bg-slate-100 rounded-t-xl relative group hover:bg-primary/20 transition-colors">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-primary/50 rounded-t-xl transition-all duration-500 group-hover:bg-primary"
                                    style={{ height: `${h}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm text-slate-500 px-4">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {recentActivity.map((item, index) => (
                            <div key={index} className="flex gap-3 relative">
                                {index !== recentActivity.length - 1 && (
                                    <div className="absolute left-2 top-8 bottom-[-24px] w-0.5 bg-white/10" />
                                )}
                                <div className="w-4 h-4 rounded-full bg-primary mt-1.5 shrink-0 ring-4 ring-surface" />
                                <div>
                                    <p className="text-sm text-slate-600">
                                        <span className="font-bold text-slate-900">{item.user}</span> {item.action} <span className="text-primary">{item.target}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
