import React, { useState, useEffect } from 'react';
import { Check, X, Search, Filter, MoreVertical, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const Members = () => {
    const { profile } = useAuth();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (profile?.campus_id) {
            fetchMembers();
        }
    }, [profile]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
            const { members, loading, searchTerm, setSearchTerm } = useCampusMembers();

            if (loading && members.length === 0) {
                return (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                );
            }

            return (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Campus Members</h1>
                            <p className="text-slate-500">Manage and view students in your campus chapter.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" icon={Filter}>Filter</Button>
                            <Button variant="primary" icon={Mail}>Message All</Button>
                        </div>
                    </div>

                    <Card className="p-0 overflow-hidden shadow-lg">
                        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex gap-4 items-center">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white border-2 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full md:w-80 transition-all"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-900 font-semibold">
                                    <tr>
                                        <th className="p-4">Student</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Joined Date</th>
                                        <th className="p-4">XP</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {members.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-500">
                                                {searchTerm ? 'No members found' : 'No members in this campus yet'}
                                            </td>
                                        </tr>
                                    ) : (
                                        members.map((member) => (
                                            <tr key={member.id} className="hover:bg-slate-100 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                                            {member.avatar_url ? (
                                                                <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500 font-bold">
                                                                    {member.full_name?.charAt(0) || '?'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900">{member.full_name || 'Anonymous'}</div>
                                                            <div className="text-xs text-slate-500">{member.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="neutral">{member.role || 'Member'}</Badge>
                                                </td>
                                                <td className="p-4 text-slate-500">
                                                    {new Date(member.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1 font-medium text-slate-700">
                                                        <Award size={14} className="text-yellow-500" />
                                                        {member.xp || 0}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="success">Active</Badge>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Button variant="ghost" size="sm" icon={MoreVertical} />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            );
        };

        export default Members;
