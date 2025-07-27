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
    'w-auto object-contain',
    {
      'h-48 sm:h-56 md:h-64 lg:h-72 drop-shadow-2xl': isHero,
      'h-8 sm:h-10 lg:h-12 bg-white rounded-lg p-2 shadow-lg border border-gray-200': !isHero,
    },
    className
  );

  const logoSrc = isHero ? "/lovable-uploads/cbdc7bde-3b9d-4c6a-a361-e5fcde8f5d7e.png" : "/lovable-uploads/cbdc7bde-3b9d-4c6a-a361-e5fcde8f5d7e.png";

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
