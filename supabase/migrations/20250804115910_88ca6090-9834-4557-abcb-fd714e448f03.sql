-- Set up cron job for scheduled blog posts
select cron.schedule(
  'publish-scheduled-posts',
  '0 * * * *', -- every hour
  $$
  select
    net.http_post(
        url:='https://ytgmzhevgcmvevuwkocz.supabase.co/functions/v1/publish-scheduled-posts',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Z216aGV2Z2NtdmV2dXdrb2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MzA5NDgsImV4cCI6MjA2NjIwNjk0OH0.yOoZd4w7sURBnsQuGb1custfkz1_g5MGt9skysV1fPI"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);