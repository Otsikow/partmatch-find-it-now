
-- Create admin notifications table
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('new_verification', 'new_request', 'new_offer', 'status_update')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on admin notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view notifications
CREATE POLICY "Admins can view admin notifications" 
  ON public.admin_notifications 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Create policy for system to insert notifications
CREATE POLICY "System can insert admin notifications" 
  ON public.admin_notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for admins to update their notifications (mark as read)
CREATE POLICY "Admins can update admin notifications" 
  ON public.admin_notifications 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Enable realtime for admin notifications
ALTER TABLE public.admin_notifications REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.admin_notifications;
