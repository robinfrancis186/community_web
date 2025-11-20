-- Direct Messaging Setup

-- 1. Update 'channels' table to support DMs
-- Add 'type' column if it doesn't exist, with check constraint
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'channels' AND column_name = 'type') THEN
        ALTER TABLE channels ADD COLUMN type text DEFAULT 'public' CHECK (type IN ('public', 'private', 'dm'));
    END IF;
END $$;

-- 2. Create 'channel_members' table to track who is in a channel (for DMs and private channels)
CREATE TABLE IF NOT EXISTS channel_members (
    channel_id uuid REFERENCES channels(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at timestamptz DEFAULT now(),
    PRIMARY KEY (channel_id, user_id)
);

-- 3. Enable RLS on channel_members
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for channel_members

-- Users can view channel members if they are in the channel or if it's a public channel
CREATE POLICY "View channel members"
ON channel_members FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM channels c
        WHERE c.id = channel_members.channel_id
        AND (c.type = 'public' OR EXISTS (
            SELECT 1 FROM channel_members cm
            WHERE cm.channel_id = c.id
            AND cm.user_id = auth.uid()
        ))
    )
);

-- Users can add themselves to public channels
CREATE POLICY "Join public channels"
ON channel_members FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM channels c
        WHERE c.id = channel_id
        AND c.type = 'public'
    )
    OR
    -- Or if they are being added to a DM by the creator (handled via function or initial insert)
    auth.uid() IN (
        SELECT created_by FROM channels WHERE id = channel_id
    )
);

-- 5. Update 'channels' RLS to respect DMs
-- Drop existing policy if it conflicts, or create a new one for DMs
DROP POLICY IF EXISTS "View channels" ON channels;

CREATE POLICY "View channels"
ON channels FOR SELECT
USING (
    type = 'public' 
    OR 
    auth.uid() = created_by
    OR
    EXISTS (
        SELECT 1 FROM channel_members cm
        WHERE cm.channel_id = id
        AND cm.user_id = auth.uid()
    )
);

-- 6. Update 'messages' RLS to respect DMs
-- Ensure messages are only visible to channel members for private/dm channels
DROP POLICY IF EXISTS "View messages" ON messages;

CREATE POLICY "View messages"
ON messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM channels c
        WHERE c.id = channel_id
        AND (
            c.type = 'public' 
            OR 
            EXISTS (
                SELECT 1 FROM channel_members cm
                WHERE cm.channel_id = c.id
                AND cm.user_id = auth.uid()
            )
        )
    )
);

-- 7. Function to create a DM channel
CREATE OR REPLACE FUNCTION create_dm_channel(other_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_channel_id uuid;
BEGIN
    -- Check if DM already exists between these two users
    SELECT c.id INTO new_channel_id
    FROM channels c
    JOIN channel_members cm1 ON c.id = cm1.channel_id
    JOIN channel_members cm2 ON c.id = cm2.channel_id
    WHERE c.type = 'dm'
    AND cm1.user_id = auth.uid()
    AND cm2.user_id = other_user_id;

    -- If exists, return it
    IF new_channel_id IS NOT NULL THEN
        RETURN new_channel_id;
    END IF;

    -- Create new channel
    INSERT INTO channels (name, type, created_by)
    VALUES ('dm-' || auth.uid() || '-' || other_user_id, 'dm', auth.uid())
    RETURNING id INTO new_channel_id;

    -- Add members
    INSERT INTO channel_members (channel_id, user_id)
    VALUES 
        (new_channel_id, auth.uid()),
        (new_channel_id, other_user_id);

    RETURN new_channel_id;
END;
$$;
