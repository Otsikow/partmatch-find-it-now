-- Add missing INSERT policy for user_notifications
CREATE POLICY "System can insert user notifications" 
ON public.user_notifications 
FOR INSERT 
WITH CHECK (true);

-- Reset all chat unread counts to zero to fix stuck notifications
UPDATE public.chats 
SET buyer_unread_count = 0, seller_unread_count = 0, updated_at = now()
WHERE buyer_unread_count > 0 OR seller_unread_count > 0;