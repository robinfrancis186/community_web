import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const PAGE_SIZE = 10;

    useEffect(() => {
        fetchUsers();
    }, [page, searchTerm, roleFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('profiles')
                .select('*', { count: 'exact' });

            if (searchTerm) {
                query = query.ilike('full_name', `%${searchTerm}%`);
            }

            if (roleFilter !== 'all') {
                query = query.eq('role', roleFilter);
            }

            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            const { data, count, error } = await query
                .range(from, to)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setUsers(data);
            setTotalPages(Math.ceil(count / PAGE_SIZE));
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            // Optimistic update
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            return { success: true };
        } catch (err) {
            console.error('Error updating role:', err);
            return { success: false, error: err };
        }
    };

    return {
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
    };
};
