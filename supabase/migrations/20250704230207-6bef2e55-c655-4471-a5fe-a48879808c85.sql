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
  
  -- Mark messages as read
  UPDATE public.messages 
  SET is_read = true, updated_at = now()
  WHERE chat_id = chat_id_param 
    AND sender_id != user_id_param 
    AND is_read = false;
  
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
END;
$function$;