-- Add DELETE policy for user_notifications so users can clear their own notifications
CREATE POLICY "Users can delete their own notifications" 
ON public.user_notifications 
FOR DELETE 
USING (auth.uid() = user_id);