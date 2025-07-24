-- Enable Row Level Security on admin_audit_logs table
-- This will enforce the existing RLS policies on the table

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;