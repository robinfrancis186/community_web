-- Add social_links column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Update RLS policies to ensure the column is accessible (usually covered by existing policies, but good to verify)
-- Existing policies for profiles usually allow:
-- SELECT for everyone (public profiles)
-- UPDATE for users based on id (own profile)

-- If you need to be explicit about what keys are allowed, you'd handle that in the application logic or a trigger.
-- For now, we'll allow any JSONB object.

COMMENT ON COLUMN public.profiles.social_links IS 'Stores social media handles/URLs like { "linkedin": "...", "twitter": "..." }';
