import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface LogoProps {
  className?: string;
  isHero?: boolean;
  onClick?: () => void;
  disableDefaultLink?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, isHero, onClick, disableDefaultLink }) => {
  const logoClasses = cn(
    'w-auto object-contain rounded-xl bg-primary/10 p-2 shadow-lg backdrop-blur-sm border border-primary/20',
    {
      'h-48 sm:h-56 md:h-64 lg:h-72': isHero,
      'h-8 sm:h-10 lg:h-12': !isHero,
    },
    className
  );

  const logoSrc = isHero ? "/lovable-uploads/02ae2c2c-72fd-4678-8cef-3158e8e313f0.png" : "/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png";

  if (disableDefaultLink) {
    return (
      <img
        src={logoSrc}
        alt="PartMatch - Car Parts Marketplace"
        className={logoClasses}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      />
    );
  }

  return (
    <Link to="/" onClick={onClick}>
      <img
        src={logoSrc}
        alt="PartMatch - Car Parts Marketplace"
        className={logoClasses}
      />
    </Link>
  );
};

export default Logo;
