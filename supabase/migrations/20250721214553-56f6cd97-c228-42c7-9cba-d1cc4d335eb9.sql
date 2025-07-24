-- Create function to create notification when new message is sent
CREATE OR REPLACE FUNCTION public.create_message_notification()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id UUID;
  sender_name TEXT;
BEGIN
  -- Get the recipient (the other person in the chat)
  SELECT 
    CASE 
      WHEN NEW.sender_id = c.buyer_id THEN c.seller_id
      ELSE c.buyer_id
    END INTO recipient_id
  FROM public.chats c
  WHERE c.id = NEW.chat_id;
  
  -- Get sender's name from profiles
  SELECT 
    COALESCE(first_name || ' ' || last_name, email)
  INTO sender_name
  FROM public.profiles p
  WHERE p.id = NEW.sender_id;
  
  -- Create notification for the recipient
  INSERT INTO public.user_notifications (
    user_id,
    type,
    title,
    message,
    metadata
  ) VALUES (
    recipient_id,
    'chat_message',
    'New message',
    sender_name || ' sent you a message: "' || LEFT(NEW.content, 100) || CASE WHEN LENGTH(NEW.content) > 100 THEN '..."' ELSE '"' END,
    jsonb_build_object('chat_id', NEW.chat_id, 'message_id', NEW.id, 'sender_id', NEW.sender_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create notifications for new messages
DROP TRIGGER IF EXISTS trigger_create_message_notification ON public.messages;
CREATE TRIGGER trigger_create_message_notification
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.create_message_notification();