import React from 'react';
import { Search, Filter, MoreVertical, Shield, UserCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Users = () => {
    const users = [
        { id: 1, name: 'Sarah Lee', role: 'Campus Rep', campus: 'GEC Barton Hill', status: 'Active' },
        { id: 2, name: 'David Chen', role: 'Ambassador', campus: 'CET Trivandrum', status: 'Active' },
        { id: 3, name: 'John Doe', role: 'Student', campus: 'Model Engineering', status: 'Inactive' },
        { id: 4, name: 'Emily Davis', role: 'Faculty', campus: 'LBS Institute', status: 'Active' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-gray-400">Manage roles and permissions across the platform.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" icon={Filter}>Filter</Button>
                    <Button variant="primary" icon={UserCheck}>Verify Users</Button>
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-white font-medium">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Campus</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10" />
                                            <span className="font-medium text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-primary" />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="p-4">{user.campus}</td>
                                    <td className="p-4">
                                        <Badge variant={user.status === 'Active' ? 'success' : 'neutral'}>
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="sm" icon={MoreVertical} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Users;
