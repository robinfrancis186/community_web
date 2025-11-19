import React from 'react';
import { Activity, Smartphone, Heart, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';

const Impact = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Impact Tracker</h1>
                <p className="text-slate-500">Measuring the real-world difference we make.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Lives Impacted', value: '12,450', icon: Heart, color: 'text-red-400' },
                    { label: 'Devices Distributed', value: '850', icon: Smartphone, color: 'text-blue-400' },
                    { label: 'Assessments Done', value: '2,100', icon: Activity, color: 'text-green-400' },
                    { label: 'Volunteer Hours', value: '45k+', icon: Clock, color: 'text-yellow-400' },
                ].map((stat, index) => (
                    <Card key={index} className="p-6 text-center" hover>
                        <div className={`w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3 ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-500">{stat.label}</div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Device Requirements */}
                <Card>
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Device Requirements (District-wise)</h3>
                    <div className="space-y-5">
                        {[
                            { district: 'Trivandrum', needed: 120, fulfilled: 85 },
                            { district: 'Kollam', needed: 80, fulfilled: 45 },
                            { district: 'Ernakulam', needed: 150, fulfilled: 60 },
                            { district: 'Kozhikode', needed: 100, fulfilled: 90 },
                        ].map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-900 font-medium">{item.district}</span>
                                    <span className="text-slate-500">{item.fulfilled} / {item.needed}</span>
                                </div>
                                <ProgressBar progress={item.fulfilled} max={item.needed} color="secondary" className="h-2" />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Assessment Progress */}
                <Card>
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Assessment Goals</h3>
                    <div className="flex items-center justify-center h-64">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-900/5" />
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552} strokeDashoffset={552 - (552 * 0.75)} className="text-primary" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-slate-900">75%</span>
                                <span className="text-xs text-slate-500">Goal Reached</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Impact;
