import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { useAssociationNavigation } from '@app/hooks/useAssociationNavigation';

interface AssociationLogoProps {
  association: {
    id: string;
    name: string;
    slug?: string;
    logo?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTooltip?: boolean;
  clickable?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

const fallbackTextSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-xl',
};

export const AssociationLogo: React.FC<AssociationLogoProps> = ({ association, size = 'md', className = '', showTooltip = false, clickable = true }) => {
  const { navigateToAssociation } = useAssociationNavigation();

  const handleClick = () => {
    if (clickable) {
      navigateToAssociation(association.id, association.slug);
    }
  };

  const getInitials = (name: string) => {
    const words = name.split(' ');
    return words.length > 1 ? `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const logoUrl = association.logo;

  const avatarElement = (
    <Avatar className={`${sizeClasses[size]} ${clickable ? 'cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all' : ''} ${className}`} onClick={handleClick}>
      <AvatarImage src={logoUrl} alt={association.name} />
      <AvatarFallback className={`bg-primary text-primary-foreground ${fallbackTextSizes[size]}`}>{getInitials(association.name)}</AvatarFallback>
    </Avatar>
  );

  if (showTooltip) {
    return (
      <div className="group relative">
        {avatarElement}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {association.name}
        </div>
      </div>
    );
  }

  return avatarElement;
};
