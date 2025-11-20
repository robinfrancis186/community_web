import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useChat = () => {
    const { user } = useAuth();
    const [channels, setChannels] = useState([]);
    const [dms, setDms] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]); // For DM selection

    useEffect(() => {
        if (user) {
            fetchChannels();
            fetchDms();
            fetchUsers();
        }
    }, [user]);

    useEffect(() => {
        if (activeChannel) {
            fetchMessages(activeChannel.id);

            // Subscribe to new messages in this channel
            const subscription = supabase
                .channel(`messages:${activeChannel.id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `channel_id=eq.${activeChannel.id}`
                }, (payload) => {
                    // Fetch the full message with profile to get avatar/name
                    fetchSingleMessage(payload.new.id);
                })
                .subscribe();

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [activeChannel]);

    const fetchChannels = async () => {
        try {
            const { data, error } = await supabase
                .from('channels')
                .select('*')
                .eq('type', 'public')
                .order('name');

            if (error) throw error;
            setChannels(data || []);

            // Set default channel if none active
            if (!activeChannel && data && data.length > 0) {
                setActiveChannel(data[0]);
            }
        } catch (error) {
            console.error('Error fetching channels:', error);
        }
    };

    const formatDmChannel = (channel) => {
        const currentUserId = user?.id;
        const members = channel.channel_members || [];
        const otherMember = members.find((member) => member.user_id !== currentUserId);

        return {
            id: channel.id,
            name: channel.name,
            type: channel.type,
            created_at: channel.created_at,
            otherUser: otherMember?.profiles || null,
        };
    };

    const fetchDmChannelById = async (channelId) => {
        if (!channelId) return null;
        const { data, error } = await supabase
            .from('channels')
            .select(`
                id,
                name,
                type,
                created_at,
                channel_members (
                    user_id,
                    profiles (
                        id,
                        full_name,
                        avatar_url
                    )
                )
            `)
            .eq('id', channelId)
            .single();

        if (error) {
            console.error('Error fetching DM channel:', error);
            return null;
        }

        return formatDmChannel(data);
    };

    const fetchDms = async () => {
        try {
            const { data: membershipData, error: membershipError } = await supabase
                .from('channel_members')
                .select('channel_id')
                .eq('user_id', user.id);

            if (membershipError) throw membershipError;

            const channelIds = (membershipData || []).map((row) => row.channel_id);

            if (channelIds.length === 0) {
                setDms([]);
                return;
            }

            const { data, error } = await supabase
                .from('channels')
                .select(`
                    id,
                    name,
                    type,
                    created_at,
                    channel_members (
                        user_id,
                        profiles (
                            id,
                            full_name,
                            avatar_url
                        )
                    )
                `)
                .in('id', channelIds)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const dmChannels = (data || [])
                .filter((channel) => channel.type === 'dm')
                .map(formatDmChannel);

            setDms(dmChannels);
        } catch (error) {
            console.error('Error fetching DMs:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, role')
                .neq('id', user.id) // Exclude self
                .limit(20); // Limit for now

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchMessages = async (channelId) => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    profiles:user_id (
                        full_name,
                        avatar_url
                    )
                `)
                .eq('channel_id', channelId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchSingleMessage = async (messageId) => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    profiles:user_id (
                        full_name,
                        avatar_url
                    )
                `)
                .eq('id', messageId)
                .single();

            if (error) throw error;
            setMessages(prev => [...prev, data]);
        } catch (error) {
            console.error('Error fetching single message:', error);
        }
    };

    const sendMessage = async (content) => {
        if (!activeChannel || !content.trim()) return;

        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    channel_id: activeChannel.id,
                    user_id: user.id,
                    content: content.trim()
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };

    const createDm = async (otherUserId) => {
        try {
            const { data, error } = await supabase
                .rpc('create_dm_channel', { other_user_id: otherUserId });

            if (error) throw error;

            // Refresh DMs list
            await fetchDms();

            const channelData = await fetchDmChannelById(data);
            if (channelData) {
                setActiveChannel(channelData);
            }

            return data; // Returns channel ID
        } catch (error) {
            console.error('Error creating DM:', error);
            throw error;
        }
    };

    return {
        channels,
        dms,
        activeChannel,
        setActiveChannel,
        messages,
        sendMessage,
        users,
        createDm,
        loading
    };
};
