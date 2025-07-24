-- Fix user_notifications table by adding missing INSERT policy
CREATE POLICY IF NOT EXISTS "System can insert user notifications" 
ON public.user_notifications 
FOR INSERT 
WITH CHECK (true);

-- Also allow users to insert their own notifications (for testing)
CREATE POLICY IF NOT EXISTS "Users can insert their own notifications" 
ON public.user_notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix the mark_messages_as_read function to use proper parameter names
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(chat_id_param uuid, user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  chat_record RECORD;
BEGIN
  -- Get chat details
  SELECT * INTO chat_record FROM public.chats WHERE id = chat_id_param;
  
  IF NOT FOUND THEN
    RAISE NOTICE 'Chat not found: %', chat_id_param;
    RETURN;
  END IF;
  
  -- Mark messages as read
  UPDATE public.messages 
  SET is_read = true, updated_at = now()
  WHERE chat_id = chat_id_param 
    AND sender_id != user_id_param 
    AND is_read = false;
  
  RAISE NOTICE 'Marked % messages as read', FOUND;
  
  -- Reset unread count for the user
  UPDATE public.chats 
  SET 
    buyer_unread_count = CASE 
      WHEN user_id_param = chat_record.buyer_id THEN 0
      ELSE buyer_unread_count
    END,
    seller_unread_count = CASE 
      WHEN user_id_param = chat_record.seller_id THEN 0
      ELSE seller_unread_count
    END,
    updated_at = now()
  WHERE id = chat_id_param;
  
  RAISE NOTICE 'Updated chat unread counts for user: %', user_id_param;
END;
$function$;