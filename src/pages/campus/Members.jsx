import React from 'react';
import { Check, X, Search, Filter, MoreVertical } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Members = () => {
    const members = [
        { id: 1, name: 'John Doe', role: 'Student', status: 'Pending', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', role: 'Ambassador', status: 'Active', email: 'jane@example.com' },
        { id: 3, name: 'Mike Johnson', role: 'Student', status: 'Active', email: 'mike@example.com' },
        { id: 4, name: 'Emily Davis', role: 'Student', status: 'Pending', email: 'emily@example.com' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Member Management</h1>
                    <p className="text-slate-500">Manage campus members and approvals.</p>
                </div>
                <Button variant="outline" icon={Filter}>Filter</Button>
            </div>

            <Card className="p-0 overflow-hidden">
                {/* Table Header */}
                <div className="p-4 border-b border-slate-200 flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            className="bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                        />
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-slate-100 text-slate-900 font-medium">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-100 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
                                            <div>
                                                <div className="font-medium text-slate-900">{member.name}</div>
                                                <div className="text-xs">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">{member.role}</td>
                                    <td className="p-4">
                                        <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                                            {member.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        {member.status === 'Pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <Button variant="success" size="sm" icon={Check} className="w-8 h-8 p-0" />
                                                <Button variant="danger" size="sm" icon={X} className="w-8 h-8 p-0" />
                                            </div>
                                        ) : (
                                            <Button variant="ghost" size="sm" icon={MoreVertical} />
                                        )}
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

export default Members;
