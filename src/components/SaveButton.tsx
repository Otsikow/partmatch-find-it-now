
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useSavedParts } from '@/hooks/useSavedParts';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  partId: string;
  size?: 'sm' | 'default' | 'lg' | 'mobile-sm' | 'mobile-default' | 'mobile-lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  showText?: boolean;
}

const SaveButton = ({ 
  partId, 
  size = 'sm', 
  variant = 'outline',
  className,
  showText = false
}: SaveButtonProps) => {
  const { savePart, removeSavedPart, isPartSaved } = useSavedParts();
  const [isLoading, setIsLoading] = useState(false);
  const isSaved = isPartSaved(partId);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      if (isSaved) {
        await removeSavedPart(partId);
      } else {
        await savePart(partId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200",
        isSaved && "text-red-600 hover:text-red-700",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          showText && "mr-2",
          isSaved && "fill-red-500 text-red-500"
        )} 
      />
      {showText && (isSaved ? 'Saved' : 'Save')}
    </Button>
  );
};

export default SaveButton;
