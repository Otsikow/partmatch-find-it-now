-- Fix search path security vulnerability for create_message_notification function
-- This prevents search path injection attacks by setting an empty search path
ALTER FUNCTION public.create_message_notification()
SET search_path = '';