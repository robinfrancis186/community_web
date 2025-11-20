
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseKey = envConfig.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('Starting Authentication Diagnosis...');

    // 0. Test SignIn with known user (if exists)
    console.log('\n0. Attempting SignIn with member@test.com...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'member@test.com',
        password: 'test123456'
    });

    if (signInError) {
        console.log('ℹ️ SignIn failed (expected if user deleted/changed):', signInError.message);
    } else {
        console.log('✅ SignIn Successful for member@test.com');
        console.log('User ID:', signInData.user.id);
        // We could use this user to test RLS if we wanted, but let's stick to new user for now
    }

    const testEmail = `antigravity.test.${Date.now()}@gmail.com`; // Use a more "real" looking email
    const testPassword = 'password123';

    // 1. Test Signup
    console.log(`\n1. Attempting Signup with ${testEmail}...`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
            data: {
                full_name: 'Diagnostic User',
                role: 'member'
            }
        }
    });

    if (authError) {
        console.error('❌ Signup Failed:', authError.message);
        console.error('Details:', authError);
        return;
    }

    console.log('✅ Signup Successful:', authData.user?.id);
    const userId = authData.user?.id;

    if (!userId) {
        console.error('❌ No user ID returned despite no error.');
        return;
    }

    // 2. Check if Profile exists (Trigger Test)
    console.log('\n2. Checking if profile was automatically created (Trigger Test)...');
    // Give a moment for trigger to run
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { data: profileData, error: profileFetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (profileData) {
        console.log('✅ Profile found! A database trigger likely created this.');
        console.log('Profile:', profileData);
    } else {
        console.log('ℹ️ Profile not found. No automatic trigger or trigger failed/slow.');
        if (profileFetchError) {
            console.log('Fetch error (might be RLS):', profileFetchError.message);
        }
    }

    // 3. Test Manual Profile Insertion (RLS Test)
    if (!profileData) {
        console.log('\n3. Attempting manual profile insertion...');
        const { error: insertError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: userId,
                    email: testEmail,
                    full_name: 'Diagnostic User',
                    role: 'member',
                    xp: 0,
                    level: 1
                }
            ]);

        if (insertError) {
            console.error('❌ Manual Insert Failed:', insertError.message);
            console.error('Details:', insertError);
            if (insertError.code === '42501') {
                console.error('👉 CAUSE: RLS Policy Violation (Permission Denied)');
            } else if (insertError.code === '23505') {
                console.error('👉 CAUSE: Duplicate Key (Profile already exists but not visible?)');
            }
        } else {
            console.log('✅ Manual Insert Successful. RLS allows insertion.');
        }
    } else {
        console.log('\n3. Skipping manual insertion as profile already exists.');
        console.log('👉 RECOMMENDATION: Remove manual insert from frontend code to avoid "Duplicate Key" errors if trigger exists.');
    }

    // Cleanup (Optional, might fail due to RLS)
    // console.log('\nCleaning up...');
    // await supabase.auth.admin.deleteUser(userId); // Requires service role key
}

diagnose().catch(console.error);
