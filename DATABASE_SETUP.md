# Database Setup Summary

## Overview
The Supabase backend for the STRIDE Community App has been fully configured with all necessary tables, security policies, functions, and triggers.

## Database Tables

### Core Tables
1. **profiles** - User profiles with XP, level, role, and campus association
2. **campuses** - Campus information with impact scores
3. **courses** - Course catalog
4. **user_courses** - User course enrollments with progress tracking
5. **events** - Events with points and XP rewards
6. **event_registrations** - User event registrations and attendance

### Gamification Tables
7. **badges** - Badge definitions with XP rewards
8. **user_badges** - User badge achievements
9. **leaderboard** - Leaderboard rankings (auto-updated)
10. **certificates** - User certificates

### Community Features
11. **innovations** - Innovation projects repository
12. **innovation_likes** - Innovation likes
13. **innovation_comments** - Innovation comments
14. **channels** - Chat channels
15. **messages** - Chat messages

## Security (RLS Policies)

All tables have Row Level Security (RLS) enabled with appropriate policies:

- **Profiles**: Users can view all, update own
- **Courses**: Public read, admin write
- **User Courses**: Users can manage own enrollments
- **Events**: Public read, campus/admin write
- **Event Registrations**: Users can register for events
- **Badges**: Public read, admin write
- **User Badges**: Public read, system can award
- **Certificates**: Users can view own, campus/admin can issue
- **Innovations**: Public read, users can create/update own
- **Innovation Likes/Comments**: Public read, users can manage own
- **Channels**: Public channels visible to all, private to creators
- **Messages**: Accessible based on channel permissions

## Automated Features

### Triggers & Functions

1. **update_leaderboard()** - Automatically updates leaderboard when profile XP changes
2. **award_course_completion_xp()** - Awards XP when user completes a course
3. **award_event_attendance_xp()** - Awards XP when user attends an event
4. **update_innovation_likes_count()** - Updates like count on innovations
5. **update_innovation_comments_count()** - Updates comment count on innovations
6. **update_updated_at_column()** - Auto-updates `updated_at` timestamps
7. **generate_certificate_id()** - Generates unique certificate IDs

### XP & Leveling System

- Course completion: 100 XP (default)
- Event attendance: 50 XP (default, configurable per event)
- Level calculation: Level up when XP >= (level * 1000)
- Leaderboard automatically updates when XP changes

## Indexes

Performance indexes have been added for:
- User courses (user_id, course_id)
- Event registrations (user_id, event_id)
- Events (start_date, status)
- Profiles (role, campus_id)
- Leaderboard (points DESC, campus_id)
- Innovations (author_id, status)
- Messages (channel_id, created_at DESC)
- And more...

## Seed Data

Initial data has been seeded:
- **4 default channels**: general, announcements, design-help, random
- **7 default badges**: Early Adopter, Design Champion, Top Contributor, Problem Solver, Course Master, Event Enthusiast, Innovation Leader

## TypeScript Types

TypeScript types have been generated and saved to `src/lib/database.types.ts` for type-safe database queries.

## Usage

The database is ready to use! All tables, policies, and functions are in place. The frontend can now:

1. Create user profiles on signup
2. Enroll users in courses
3. Register users for events
4. Track XP and levels automatically
5. Display leaderboards
6. Manage innovations, badges, and certificates
7. Enable chat functionality

## Security Status

✅ All security advisors pass - no warnings or issues detected.

## Next Steps

1. Ensure environment variables are set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. The frontend code should work seamlessly with the database schema as it matches the existing hooks and components.

