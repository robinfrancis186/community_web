# Feature Implementation Walkthrough

This document outlines the new features implemented in the STRIDE Community WebApp, covering Core UX, Profile Settings, Content, and Messaging.

## 1. Core UX & Theming

### Preloader
A global preloader now appears during the initial authentication check, displaying the pulsing STRIDE logo.
- **File**: `src/components/ui/Preloader.jsx`
- **Behavior**: Shows automatically on app load until the user session is verified.

### Dark Mode
Full dark mode support has been added using Tailwind's class strategy.
- **Toggle**: A Sun/Moon icon button in the Navbar allows users to switch themes.
- **Persistence**: The selected theme is saved in `localStorage`.
- **Implementation**: `src/contexts/ThemeContext.jsx` manages the state and updates the `<html>` class.

## 2. Profile & Settings

### Profile Picture Upload
Users can now upload a custom profile picture.
- **Location**: Profile Page -> "General Profile" tab.
- **Backend**: Uses Supabase Storage (`avatars` bucket).
- **Security**: RLS policies ensure users can only modify their own avatars.

### Password Change
A secure form for updating passwords.
- **Location**: Profile Page -> "Security" tab.
- **Functionality**: Validates password match and uses Supabase Auth API to update credentials.

## 3. Content & Assistance

### Help & FAQ
A dedicated Help Center with common questions.
- **Location**: `/member/help` (accessible via Sidebar).
- **Features**: Accordion-style FAQ items categorized by topic.

### Upcoming Events Widget
A dashboard widget displaying real upcoming events.
- **Location**: Member Dashboard (Right column).
- **Data**: Fetches the next 3 events from the `events` table where `start_date` is in the future.

### Contextual Help
A floating "Need Help?" button.
- **Location**: Bottom-right corner of the screen (global).
- **Action**: Redirects to the Help page (can be expanded to a modal in future).

## 4. Community Messaging (DMs)

### Direct Messages
Users can now start private conversations with other members.
- **Location**: Community Chat page.
- **Features**:
    - **Channel List**: Shows public channels and active DMs.
    - **New Message**: "+" button opens a user search modal to start a new DM.
    - **Real-time**: Messages update automatically using Supabase Realtime subscriptions.
- **Backend**: Uses a `channel_members` table to track DM participants and secure RLS policies.

## Verification Steps

1.  **Theme**: Toggle the theme in the Navbar. Ensure all pages (Dashboard, Profile, Chat) look correct in both modes.
2.  **Profile**: Go to Profile. Upload a new picture. Refresh to see it persists. Change password (optional).
3.  **Help**: Click "Help" in the sidebar. Expand FAQs. Click the floating "?" button.
4.  **Events**: Check the Dashboard. Ensure "Upcoming Events" shows data (if events exist in DB).
5.  **Chat**:
    - Go to "Community".
    - Click "+" next to Direct Messages.
    - Search for a user and click to start a DM.
    - Send a message.
    - Verify the message appears immediately.
