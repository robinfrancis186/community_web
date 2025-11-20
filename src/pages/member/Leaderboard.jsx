import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Search, Filter, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import clsx from 'clsx';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState('global');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { profile } = useAuth();

    useEffect(() => {
        fetchLeaderboard();
    }, [activeTab]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('leaderboard')
                .select(`
                    *,
                    profiles:user_id (
                        id,
                        full_name,
                        email,
                        avatar_url,
                        campus_id
                    ),
                    campuses:campus_id (
                        id,
                        name
                    )
                `)
                .order('points', { ascending: false })
                .order('updated_at', { ascending: true })
                .limit(100);

            if (activeTab === 'campus' && profile?.campus_id) {
                query = query.eq('campus_id', profile.campus_id);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Update ranks
            const rankedData = (data || []).map((item, index) => ({
                ...item,
                rank: index + 1,
                name: item.profiles?.full_name || 'Anonymous',
                campus: item.campuses?.name || 'No Campus',
                avatar: item.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.profiles?.email || 'user'}`
            }));

            setLeaderboardData(rankedData);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = leaderboardData.filter(item => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(query) ||
            item.campus.toLowerCase().includes(query);
    });

    const topThree = filteredData.slice(0, 3);
    const rest = filteredData.slice(3);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-500">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Leaderboard</h1>
                    <p className="text-slate-500">See who's leading the innovation movement.</p>
                </div>

                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    {['global', 'campus'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            disabled={tab === 'campus' && !profile?.campus_id}
                            className={clsx(
                                'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize',
                                activeTab === tab
                                    ? 'bg-gradient-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                                tab === 'campus' && !profile?.campus_id && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top 3 Podium */}
                {topThree.length >= 3 && (
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                        {/* 2nd Place */}
                        <Card className="order-2 md:order-1 bg-gradient-to-br from-slate-50 to-white border-slate-200 flex flex-col items-center p-6 transform md:translate-y-4 hover">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 rounded-full border-4 border-slate-300 overflow-hidden shadow-lg">
                                    <img src={topThree[1].avatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-slate-300 to-slate-400 text-white font-bold w-9 h-9 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                                    2
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{topThree[1].name}</h3>
                            <p className="text-sm text-slate-500 mb-2">{topThree[1].campus}</p>
                            <Badge variant="neutral" className="text-base font-semibold px-4 py-1.5">{topThree[1].points || 0} PTS</Badge>
                        </Card>

                        {/* 1st Place */}
                        <Card className="order-1 md:order-2 bg-gradient-to-br from-amber-50 via-yellow-50 to-white border-amber-200 flex flex-col items-center p-8 relative overflow-visible z-10 shadow-xl hover">
                            <div className="absolute -top-6 text-amber-400 drop-shadow-lg">
                                <Trophy size={44} fill="currentColor" className="animate-pulse-slow" />
                            </div>
                            <div className="relative mb-4 mt-4">
                                <div className="w-28 h-28 rounded-full border-4 border-amber-400 overflow-hidden shadow-[0_0_30px_rgba(251,191,36,0.5)] ring-4 ring-amber-100">
                                    <img src={topThree[0].avatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-amber-400 to-yellow-500 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                                    1
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{topThree[0].name}</h3>
                            <p className="text-sm text-slate-600 mb-3">{topThree[0].campus}</p>
                            <Badge gradient variant="warning" className="text-lg px-5 py-2 font-bold shadow-lg">{topThree[0].points || 0} PTS</Badge>
                        </Card>

                        {/* 3rd Place */}
                        <Card className="order-3 md:order-3 bg-gradient-to-br from-orange-50 to-white border-orange-200 flex flex-col items-center p-6 transform md:translate-y-8 hover">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 rounded-full border-4 border-orange-400 overflow-hidden shadow-lg">
                                    <img src={topThree[2].avatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-orange-400 to-orange-500 text-white font-bold w-9 h-9 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                                    3
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{topThree[2].name}</h3>
                            <p className="text-sm text-slate-500 mb-2">{topThree[2].campus}</p>
                            <Badge variant="warning" className="text-base font-semibold px-4 py-1.5">{topThree[2].points || 0} PTS</Badge>
                        </Card>
                    </div>
                )}

                {/* List View */}
                <Card className="lg:col-span-3">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white border-2 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all"
                            />
                        </div>
                        <Button variant="outline" icon={Filter}>Filter</Button>
                    </div>

                    {rest.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {searchQuery ? 'No members found matching your search.' : 'No members on the leaderboard yet.'}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {rest.map((user) => (
                                <div key={user.user_id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-slate-600 font-bold w-8 text-center">{user.rank}</span>
                                        <img src={user.avatar} alt="" className="w-11 h-11 rounded-full border-2 border-slate-200 group-hover:border-primary/50 transition-all" />
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{user.name}</h4>
                                            <p className="text-xs text-slate-500">{user.campus}</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-transparent bg-clip-text bg-gradient-secondary">{user.points || 0} PTS</div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Leaderboard;
