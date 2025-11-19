import React from 'react';
import { TrendingUp, Users, Clock, Award } from 'lucide-react';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';

const Analytics = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics & Reports</h1>
                <p className="text-slate-500">Detailed insights into campus performance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Participation Stats */}
                <Card>
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Participation by Department</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Computer Science', value: 85 },
                            { label: 'Electronics', value: 65 },
                            { label: 'Mechanical', value: 45 },
                            { label: 'Civil', value: 30 },
                        ].map((dept, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">{dept.label}</span>
                                    <span className="text-slate-900 font-bold">{dept.value}%</span>
                                </div>
                                <ProgressBar progress={dept.value} color="primary" className="h-2" />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Impact Metrics */}
                <Card>
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Impact Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-100 text-center">
                            <div className="text-3xl font-bold text-secondary mb-1">1,240</div>
                            <div className="text-xs text-slate-500">Lives Impacted</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-100 text-center">
                            <div className="text-3xl font-bold text-green-400 mb-1">450</div>
                            <div className="text-xs text-slate-500">Devices Distributed</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-100 text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-1">2,400</div>
                            <div className="text-xs text-slate-500">Volunteer Hours</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-100 text-center">
                            <div className="text-3xl font-bold text-yellow-400 mb-1">15</div>
                            <div className="text-xs text-slate-500">Partner Schools</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
