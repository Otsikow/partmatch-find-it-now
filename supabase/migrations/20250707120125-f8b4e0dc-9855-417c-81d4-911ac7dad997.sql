-- Fix user_type enum creation issue
-- Drop and recreate the user_type enum to ensure it exists properly
DROP TYPE IF EXISTS user_type CASCADE;

-- Create the user_type enum with all required values
CREATE TYPE user_type AS ENUM ('owner', 'supplier', 'admin');

-- Update the profiles table to use the user_type enum properly
ALTER TABLE profiles 
ALTER COLUMN user_type TYPE user_type 
USING user_type::text::user_type;