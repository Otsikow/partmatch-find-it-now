-- Enable required extensions for cron jobs and HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule weekly insight agent to run every Sunday at 6 PM UTC
-- This will automatically generate and email weekly marketplace insights
SELECT cron.schedule(
  'weekly-insights-sunday-6pm',
  '0 18 * * 0', -- Every Sunday at 6 PM (18:00) UTC
  $$
  SELECT
    net.http_post(
        url:='https://ytgmzhevgcmvevuwkocz.supabase.co/functions/v1/weekly-insight-agent',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Z216aGV2Z2NtdmV2dXdrb2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MzA5NDgsImV4cCI6MjA2NjIwNjk0OH0.yOoZd4w7sURBnsQuGb1custfkz1_g5MGt9skysV1fPI"}'::jsonb,
        body:='{"scheduled": true, "timestamp": "' || now()::text || '"}'::jsonb
    ) as request_id;
  $$
);

-- Create a function to manually trigger insights generation (for testing)
CREATE OR REPLACE FUNCTION public.generate_weekly_insights_now()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  response_id BIGINT;
BEGIN
  SELECT net.http_post(
    url:='https://ytgmzhevgcmvevuwkocz.supabase.co/functions/v1/weekly-insight-agent',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Z216aGV2Z2NtdmV2dXdrb2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MzA5NDgsImV4cCI6MjA2NjIwNjk0OH0.yOoZd4w7sURBnsQuGb1custfkz1_g5MGt9skysV1fPI"}'::jsonb,
    body:='{"manual_trigger": true, "timestamp": "' || now()::text || '"}'::jsonb
  ) INTO response_id;
  
  RETURN 'Weekly insights generation triggered. Request ID: ' || response_id::text;
END;
$$;

-- Create index on admin_notifications for better performance when fetching insights
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type_created 
ON admin_notifications(type, created_at DESC) 
WHERE type = 'weekly_insights';

-- Create index on listing_analytics for insights queries
CREATE INDEX IF NOT EXISTS idx_listing_analytics_event_created 
ON listing_analytics(event_type, created_at DESC);

-- Grant necessary permissions for the cron job function
GRANT EXECUTE ON FUNCTION public.generate_weekly_insights_now() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_weekly_insights_now() TO service_role;