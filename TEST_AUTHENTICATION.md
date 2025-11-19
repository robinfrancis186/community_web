# Authentication Testing Guide

## Prerequisites

1. Ensure your `.env.local` file has the correct Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Testing Steps

### 1. Test Account Creation (Sign Up)

1. Navigate to the login page (`/login`)
2. Click "Don't have an account? Sign up"
3. Fill in the form:
   - **Full Name**: Test User
   - **Email**: test@example.com (use a real email for verification)
   - **Password**: test123456 (minimum 6 characters)
   - **Role**: Select one of:
     - Member (Student/Ambassador)
     - Campus Representative
     - Administrator
4. Click "Create Account"
5. **Expected Result**: 
   - Account created successfully
   - Redirected to dashboard based on role (`/member/dashboard`, `/campus/dashboard`, or `/admin/dashboard`)
   - Profile created in `profiles` table with XP=0, Level=1

### 2. Test Login

1. If you just signed up, sign out first
2. On the login page, enter:
   - **Email**: test@example.com
   - **Password**: test123456
3. Click "Sign In"
4. **Expected Result**:
   - Successfully logged in
   - Redirected to appropriate dashboard
   - Profile data loaded

### 3. Verify Database Records

After creating an account, verify in Supabase:

```sql
-- Check profile was created
SELECT id, email, full_name, role, xp, level, campus_id 
FROM profiles 
WHERE email = 'test@example.com';

-- Check leaderboard entry was created
SELECT * FROM leaderboard 
WHERE user_id = (SELECT id FROM profiles WHERE email = 'test@example.com');
```

## Test Accounts

You can create multiple test accounts with different roles:

### Member Account
- Email: member@test.com
- Password: test123456
- Role: member

### Campus Account
- Email: campus@test.com
- Password: test123456
- Role: campus

### Admin Account
- Email: admin@test.com
- Password: test123456
- Role: admin

## Expected Behavior

### On Sign Up:
1. ✅ User created in `auth.users` table
2. ✅ Profile created in `profiles` table with:
   - Same ID as auth user
   - Email, full_name, role
   - XP = 0, Level = 1
3. ✅ Leaderboard entry created automatically (via trigger)
4. ✅ User redirected to role-specific dashboard

### On Sign In:
1. ✅ Session created
2. ✅ Profile data fetched
3. ✅ User redirected to appropriate dashboard

### On Sign Out:
1. ✅ Session cleared
2. ✅ User redirected to login page

## Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Check that `.env.local` exists and has correct values

### Issue: "Error fetching profile"
**Solution**: 
- Check RLS policies allow profile read
- Verify profile was created on signup
- Check browser console for detailed error

### Issue: "Cannot sign up"
**Solution**:
- Check email is valid format
- Password must be at least 6 characters
- Check Supabase project settings allow email signups
- Verify email confirmation is disabled (for testing) or check email inbox

### Issue: "Profile not created on signup"
**Solution**:
- Check RLS policy allows INSERT on profiles
- Verify trigger function `update_leaderboard` exists
- Check Supabase logs for errors

## Manual Database Verification

Run these queries in Supabase SQL Editor:

```sql
-- List all profiles
SELECT id, email, full_name, role, xp, level, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- List all users in auth
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Check leaderboard
SELECT 
    p.email,
    p.full_name,
    p.role,
    l.points,
    l.rank,
    c.name as campus_name
FROM leaderboard l
JOIN profiles p ON l.user_id = p.id
LEFT JOIN campuses c ON l.campus_id = c.id
ORDER BY l.rank NULLS LAST;
```

## Next Steps After Authentication Works

1. ✅ Test enrolling in a course
2. ✅ Test registering for an event
3. ✅ Verify XP is awarded on course completion
4. ✅ Verify leaderboard updates automatically
5. ✅ Test different role permissions

