import React from 'react';
import { TrendingUp, Users, Clock, Award, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import { useCampusAnalytics } from '../../hooks/useCampusAnalytics';

const Analytics = () => {
    const { participationByDept, impactMetrics, loading } = useCampusAnalytics();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

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
                        {participationByDept.map((dept, index) => (
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
                            <div className="text-3xl font-bold text-secondary mb-1">{impactMetrics.livesImpacted.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">Lives Impacted</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-100 text-center">
                            <div className="text-3xl font-bold text-green-400 mb-1">{impactMetrics.devicesDistributed.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">Devices Distributed</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-100 text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-1">{impactMetrics.volunteerHours.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">Volunteer Hours</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-100 text-center">
                            <div className="text-3xl font-bold text-yellow-400 mb-1">{impactMetrics.partnerSchools.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">Partner Schools</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
