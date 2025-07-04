CREATE OR REPLACE FUNCTION public.update_chat_on_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  chat_record RECORD;
BEGIN
  -- Get chat details
  SELECT * INTO chat_record FROM public.chats WHERE id = NEW.chat_id;
  
  -- Update chat with last message info
  UPDATE public.chats 
  SET 
    last_message = NEW.content,
    last_message_at = NEW.created_at,
    updated_at = NEW.created_at,
    buyer_unread_count = CASE 
      WHEN NEW.sender_id = chat_record.seller_id THEN chat_record.buyer_unread_count + 1
      ELSE chat_record.buyer_unread_count
    END,
    seller_unread_count = CASE 
      WHEN NEW.sender_id = chat_record.buyer_id THEN chat_record.seller_unread_count + 1
      ELSE chat_record.seller_unread_count
    END
  WHERE id = NEW.chat_id;
  
  RETURN NEW;
END;
$function$;