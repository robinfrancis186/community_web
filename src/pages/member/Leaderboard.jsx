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

                <div className="flex bg-surface p-1 rounded-xl border border-slate-200">
                    {['global', 'campus'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            disabled={tab === 'campus' && !profile?.campus_id}
                            className={clsx(
                                'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                                activeTab === tab
                                    ? 'bg-primary text-slate-900 shadow-lg'
                                    : 'text-slate-500 hover:text-slate-900',
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
                        <Card className="order-2 md:order-1 bg-gradient-to-b from-surface to-surface/50 border-white/5 flex flex-col items-center p-6 transform md:translate-y-4">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 rounded-full border-4 border-gray-400 overflow-hidden">
                                    <img src={topThree[1].avatar} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-surface">
                                    2
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{topThree[1].name}</h3>
                            <p className="text-sm text-slate-500 mb-2">{topThree[1].campus}</p>
                            <Badge variant="neutral" className="text-lg px-3 py-1">{topThree[1].points || 0} PTS</Badge>
                        </Card>

                        {/* 1st Place */}
                        <Card className="order-1 md:order-2 bg-gradient-to-b from-primary/20 to-surface border-primary/30 flex flex-col items-center p-8 relative overflow-visible z-10">
                            <div className="absolute -top-6 text-yellow-400">
                                <Trophy size={40} fill="currentColor" />
                            </div>
                            <div className="relative mb-4 mt-4">
                                <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                                    <img src={topThree[0].avatar} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-surface">
                                    1
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{topThree[0].name}</h3>
                            <p className="text-sm text-slate-500 mb-2">{topThree[0].campus}</p>
                            <Badge variant="warning" className="text-xl px-4 py-1 font-bold">{topThree[0].points || 0} PTS</Badge>
                        </Card>

                        {/* 3rd Place */}
                        <Card className="order-3 md:order-3 bg-gradient-to-b from-surface to-surface/50 border-white/5 flex flex-col items-center p-6 transform md:translate-y-8">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 rounded-full border-4 border-orange-700 overflow-hidden">
                                    <img src={topThree[2].avatar} alt="" className="w-full h-full" />
                                </div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-700 text-slate-900 font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-surface">
                                    3
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{topThree[2].name}</h3>
                            <p className="text-sm text-slate-500 mb-2">{topThree[2].campus}</p>
                            <Badge variant="neutral" className="text-lg px-3 py-1">{topThree[2].points || 0} PTS</Badge>
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
                                className="bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
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
                                <div key={user.user_id} className="flex items-center justify-between p-4 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="text-slate-500 font-bold w-6">{user.rank}</span>
                                        <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <h4 className="font-bold text-slate-900">{user.name}</h4>
                                            <p className="text-xs text-slate-500">{user.campus}</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-secondary">{user.points || 0} PTS</div>
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
