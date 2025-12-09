import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const useMockSupabase = import.meta.env.VITE_USE_MOCK_SUPABASE === 'true';

/**
 * Simple in-memory mock client so the app can run without real Supabase
 * credentials (useful for demos or UI-only reviews).
 */
const createMockSupabaseClient = () => {
    const mockUser = {
        id: 'mock-user-id',
        email: 'demo@stride.com',
        aud: 'authenticated',
        role: 'authenticated',
    };

    const mockProfile = {
        id: 'mock-user-id',
        full_name: 'Demo User',
        role: 'member',
        avatar_url: null,
        email: 'demo@stride.com',
    };

    const mockResponse = (data = []) => ({ data, error: null, count: null });

    const createQueryBuilder = () => ({
        select: () => mockResponse([]),
        insert: () => mockResponse([]),
        upsert: () => mockResponse([]),
        update: () => mockResponse([]),
        delete: () => mockResponse([]),
        eq: () => createQueryBuilder(),
        order: () => createQueryBuilder(),
        limit: () => createQueryBuilder(),
        range: () => createQueryBuilder(),
        single: () => mockResponse(mockProfile),
        maybeSingle: () => mockResponse(null),
    });

    return {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: (callback) => {
                callback('SIGNED_OUT', null);
                return { data: { subscription: { unsubscribe: () => { } } } };
            },
            signUp: async () => ({ data: { user: mockUser, session: { user: mockUser } }, error: null }),
            signInWithPassword: async () => ({ data: { user: mockUser, session: { user: mockUser } }, error: null }),
            signOut: async () => ({ error: null }),
        },
        from: () => createQueryBuilder(),
        rpc: async () => mockResponse([]),
    };
};

let supabaseClient;

if (useMockSupabase || !supabaseUrl || !supabaseAnonKey) {
    console.warn('Using mock Supabase client (no credentials provided or VITE_USE_MOCK_SUPABASE=true).');
    supabaseClient = createMockSupabaseClient();
} else {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;
export const isMockSupabase = useMockSupabase || !supabaseUrl || !supabaseAnonKey;
