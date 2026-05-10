-- Run this in your Supabase SQL editor to add Clerk integration columns.

ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id VARCHAR UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
