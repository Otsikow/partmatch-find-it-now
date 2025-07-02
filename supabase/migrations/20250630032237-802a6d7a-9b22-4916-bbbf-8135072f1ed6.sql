
-- Create chats table for conversation threads
CREATE TABLE public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  part_id UUID REFERENCES public.car_parts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  buyer_unread_count INTEGER DEFAULT 0,
  seller_unread_count INTEGER DEFAULT 0,
  UNIQUE(buyer_id, seller_id, part_id)
);

-- Create messages table for individual messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_chat_status table for typing indicators and online status
CREATE TABLE public.user_chat_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  is_typing BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, chat_id)
);

-- Enable Row Level Security
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chat_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats
CREATE POLICY "Users can view their own chats" ON public.chats
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create chats" ON public.chats
  FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can update their own chats" ON public.chats
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages from their chats" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chats 
      WHERE chats.id = messages.chat_id 
      AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can create messages in their chats" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.chats 
      WHERE chats.id = messages.chat_id 
      AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid());

-- RLS Policies for user_chat_status
CREATE POLICY "Users can view chat status for their chats" ON public.user_chat_status
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.chats 
      WHERE chats.id = user_chat_status.chat_id 
      AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own chat status" ON public.user_chat_status
  FOR ALL USING (user_id = auth.uid());

-- Admin policies for moderation
CREATE POLICY "Admins can view all chats" ON public.chats
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin')
  );

CREATE POLICY "Admins can view all messages" ON public.messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin')
  );

-- Functions to update chat metadata when messages are sent
CREATE OR REPLACE FUNCTION update_chat_on_message() 
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Trigger to update chat when message is inserted
CREATE TRIGGER update_chat_on_message_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_on_message();

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(chat_id_param UUID, user_id_param UUID)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Enable realtime for the tables
ALTER TABLE public.chats REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.user_chat_status REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_chat_status;
