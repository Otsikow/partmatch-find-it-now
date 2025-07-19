-- Fix search path security vulnerability for generate_weekly_insights_now function
-- This prevents search path injection attacks by setting an empty search path
ALTER FUNCTION public.generate_weekly_insights_now()
SET search_path = '';