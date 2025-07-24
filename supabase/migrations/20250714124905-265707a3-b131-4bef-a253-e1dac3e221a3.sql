-- Enable Row Level Security on profiles table
-- This will enforce the existing RLS policies on the table

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;