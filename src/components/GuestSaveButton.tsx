import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface GuestSaveButtonProps {
  partId: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  showText?: boolean;
}

const GuestSaveButton = ({ 
  partId, 
  size = 'sm', 
  variant = 'outline',
  className,
  showText = false
}: GuestSaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedParts = JSON.parse(localStorage.getItem('guestSavedParts') || '[]');
    setIsSaved(savedParts.includes(partId));
  }, [partId]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const savedParts = JSON.parse(localStorage.getItem('guestSavedParts') || '[]');
    
    if (isSaved) {
      // Remove from saved parts
      const updatedParts = savedParts.filter((id: string) => id !== partId);
      localStorage.setItem('guestSavedParts', JSON.stringify(updatedParts));
      setIsSaved(false);
      
      toast({
        title: "Removed from Wishlist",
        description: "Part removed from your temporary wishlist. Create an account to save permanently.",
      });
    } else {
      // Add to saved parts
      const updatedParts = [...savedParts, partId];
      localStorage.setItem('guestSavedParts', JSON.stringify(updatedParts));
      setIsSaved(true);
      
      toast({
        title: "Added to Wishlist",
        description: "Part saved temporarily. Create an account to keep your wishlist forever!",
      });
      
      // Show promotion message after a few seconds
      setTimeout(() => {
        toast({
          title: "💡 Pro Tip",
          description: "Create a free account to sync your wishlist across devices and never lose it!",
          action: (
            <Button 
              size="sm" 
              onClick={() => window.location.href = "/auth"}
              className="ml-2"
            >
              Sign Up Free
            </Button>
          ),
        });
      }, 3000);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
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

export default GuestSaveButton;