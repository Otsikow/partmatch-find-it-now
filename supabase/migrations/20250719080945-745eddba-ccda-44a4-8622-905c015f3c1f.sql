-- Fix security issue: Move pg_net extension from public schema to extensions schema
-- This prevents namespace conflicts and follows security best practices

-- First, drop the extension from public schema
DROP EXTENSION IF EXISTS pg_net;

-- Then recreate it in the extensions schema
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;