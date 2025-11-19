import React from 'react';
import { Users, Globe, TrendingUp, Activity, Map } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const Dashboard = () => {
    const stats = [
        { label: 'Total Users', value: '12,450', icon: Users, color: 'text-blue-400', change: '+8%' },
        { label: 'Active Campuses', value: '42', icon: Globe, color: 'text-green-400', change: '+3' },
        { label: 'Total Impact Hours', value: '45,200', icon: Activity, color: 'text-purple-400', change: '+15%' },
        { label: 'Designathon Projects', value: '320', icon: TrendingUp, color: 'text-yellow-400', change: '+24%' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Master Dashboard</h1>
                <p className="text-gray-400">Global overview of STRIDE community impact.</p>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-6" hover>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <Badge variant="success">{stat.change}</Badge>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Heatmap Placeholder */}
                <Card className="lg:col-span-2 min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Campus Performance Heatmap</h3>
                        <Badge variant="neutral">Kerala Region</Badge>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-xl relative overflow-hidden flex items-center justify-center">
                        <Map size={64} className="text-white/10" />
                        <p className="text-gray-500 absolute bottom-4">Interactive Map Visualization Placeholder</p>

                        {/* Mock Heatmap Points */}
                        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full blur-md animate-pulse" />
                        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-orange-500 rounded-full blur-md animate-pulse" />
                        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-yellow-500 rounded-full blur-md animate-pulse" />
                        <div className="absolute center w-8 h-8 bg-red-600 rounded-full blur-xl opacity-50" />
                    </div>
                </Card>

                {/* Top Performing Campuses */}
                <Card>
                    <h3 className="text-xl font-bold text-white mb-6">Top Campuses</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'GEC Barton Hill', score: 98, trend: 'up' },
                            { name: 'CET Trivandrum', score: 95, trend: 'up' },
                            { name: 'Model Engineering', score: 92, trend: 'down' },
                            { name: 'LBS Institute', score: 88, trend: 'up' },
                            { name: 'GEC Thrissur', score: 85, trend: 'up' },
                        ].map((campus, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="font-bold text-gray-400 w-4">{index + 1}</div>
                                    <div className="font-medium text-white">{campus.name}</div>
                                </div>
                                <div className="font-bold text-secondary">{campus.score}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
