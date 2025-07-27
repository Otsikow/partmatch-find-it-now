-- Fix RLS policies for chats table to allow proper chat creation

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can create chats" ON public.chats;
DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can update their own chats" ON public.chats;
DROP POLICY IF EXISTS "Admins can view all chats" ON public.chats;

-- Create updated policies with better logic
CREATE POLICY "Users can create chats for themselves" 
ON public.chats 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = buyer_id OR auth.uid() = seller_id)
);

CREATE POLICY "Users can view their own chats" 
ON public.chats 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = buyer_id OR auth.uid() = seller_id)
);

CREATE POLICY "Users can update their own chats" 
ON public.chats 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = buyer_id OR auth.uid() = seller_id)
);

CREATE POLICY "Admins can view all chats" 
ON public.chats 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
);

-- Also ensure that anyone can create chats if they are authenticated
-- This is a more permissive policy for chat creation
CREATE POLICY "Authenticated users can create chats" 
ON public.chats 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);