import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationCountProps {
  type?: string;
  className?: string;
}

const NotificationCount = ({ type, className = "" }: NotificationCountProps) => {
  const { notifications } = useNotifications();
  
  const filteredNotifications = type 
    ? notifications.filter(n => n.type === type && !n.read)
    : notifications.filter(n => !n.read);
  
  const count = filteredNotifications.length;
  
  if (count === 0) return null;
  
  return (
    <Badge 
      variant="destructive" 
      className={`absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs ${className}`}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
};

export default NotificationCount;