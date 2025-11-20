import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                // If profile doesn't exist, it might be created by trigger soon
                // Wait a bit and retry once
                if (error.code === 'PGRST116') {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const { data: retryData, error: retryError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', userId)
                        .single();
                    
                    if (retryError) {
                        console.error('Error fetching profile after retry:', retryError.message);
                        setProfile(null);
                    } else {
                        setProfile(retryData);
                    }
                } else {
                    throw error;
                }
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error.message);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email, password, fullName, role = 'member') => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                    },
                    emailRedirectTo: `${window.location.origin}/login`
                }
            });

            if (error) throw error;

            // Profile is created automatically by database trigger (SECURITY DEFINER bypasses RLS)
            // Wait for trigger to execute, then fetch profile
            if (data.user && data.session) {
                // Wait for the trigger to execute (trigger runs asynchronously after INSERT)
                // The trigger function runs as SECURITY DEFINER, so it bypasses RLS
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Fetch profile - the trigger should have created it by now
                // fetchProfile has retry logic built in
                await fetchProfile(data.user.id);
            }

            return { data, error: null };
        } catch (error) {
            console.error('Signup error:', error);
            return { data: null, error };
        }
    };

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Wait for session to be established and fetch profile
            if (data.user) {
                // Wait a bit for session to be fully established
                await new Promise(resolve => setTimeout(resolve, 300));
                await fetchProfile(data.user.id);
            }

            return { data, error: null };
        } catch (error) {
            console.error('Signin error:', error);
            return { data: null, error };
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setProfile(null);
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        role: profile?.role || null,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
