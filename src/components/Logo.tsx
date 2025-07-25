import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface LogoProps {
  className?: string;
  isHero?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, isHero }) => {
  const { theme } = useTheme();
  const logoClasses = cn(
    'w-auto object-contain',
    {
      'h-48 sm:h-56 md:h-64 lg:h-72': isHero,
    },
    className
  );

  const logoSrc = isHero
    ? (theme === 'dark'
      ? "/lovable-uploads/partmatch-hero-logo.png"
      : "/lovable-uploads/0bb9488b-2f77-4f4c-b8b3-8aa9343b1d18.png")
    : (theme === 'dark'
      ? "/lovable-uploads/0bb9488b-2f77-4f4c-b8b3-8aa9343b1d18.png"
      : "/lovable-uploads/partmatch-hero-logo.png");

  return (
    <img
      src={logoSrc}
      alt="PartMatch - Car Parts Marketplace"
      className={logoClasses}
    />
  );
};

export default Logo;
