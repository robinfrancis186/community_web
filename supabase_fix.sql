-- Fix for Infinite Recursion in Profiles RLS

-- 1. Drop existing policies on profiles to start fresh
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
-- Also drop any other potential policies that might be causing issues
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

-- 2. Create corrected policies

-- Allow everyone to read profiles (needed for leaderboard, community features, etc.)
-- This avoids recursion by not checking any conditions other than being authenticated (or public if you want)
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING ( true );

-- Allow users to insert their OWN profile during signup
-- This checks that the ID of the new row matches the authenticated user's ID
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK ( auth.uid() = id );

-- Allow users to update their OWN profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING ( auth.uid() = id );

-- Note: If you have an admin role that needs to update OTHERS' profiles, 
-- you should use a policy that checks app_metadata or user_metadata, NOT the profiles table.
-- Example (Optional):
-- CREATE POLICY "Admins can update all profiles"
-- ON profiles FOR UPDATE
-- USING ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );
