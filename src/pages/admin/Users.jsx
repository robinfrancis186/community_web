import React from 'react';
import { Search, Filter, MoreVertical, Shield, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAdminUsers } from '../../hooks/useAdminUsers';

const Users = () => {
    const {
        users,
        loading,
        error,
        page,
        setPage,
        totalPages,
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        updateUserRole
    } = useAdminUsers();

    const handleRoleChange = async (userId, newRole) => {
        const result = await updateUserRole(userId, newRole);
        if (!result.success) {
            // Error is handled in the hook state if needed, or we can show a toast
            console.error('Failed to update role');
        }
    };

    if (loading && users.length === 0) {
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
                    <p className="text-slate-500">Manage roles and permissions across the platform.</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Roles</option>
                        <option value="member">Member</option>
                        <option value="campus">Campus</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-red-600">{error.message || 'An error occurred'}</p>
                </div>
            )}

            <Card className="p-0 overflow-hidden shadow-lg">
                <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
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
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Campus</th>
                                <th className="p-4">XP</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        {searchTerm ? 'No users found' : 'No users yet'}
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-100 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500 font-bold">
                                                            {user.full_name?.charAt(0) || '?'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{user.full_name || 'Anonymous'}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={user.role || 'member'}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="px-3 py-1.5 border-2 border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white transition-all"
                                            >
                                                <option value="member">Member</option>
                                                <option value="campus">Campus</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-4">{user.campuses?.name || 'No Campus'}</td>
                                        <td className="p-4 text-slate-700 font-medium">{user.xp || 0}</td>
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

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            icon={ChevronLeft}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            icon={ChevronRight}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Users;

