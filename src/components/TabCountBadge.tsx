import React from 'react';
import { Badge } from "@/components/ui/badge";

interface TabCountBadgeProps {
  count: number;
}

const TabCountBadge = ({ count }: TabCountBadgeProps) => {
  if (count === 0) return null;

  return (
    <Badge className="bg-orange-600 text-white text-xs ml-1">
      {count > 99 ? '99+' : count}
    </Badge>
  );
};

export default TabCountBadge;
