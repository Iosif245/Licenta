import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Share2, Mail, Globe, Heart, MessageSquare } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@app/components/ui/tooltip';
import React from 'react';

interface AssociationHeaderProps {
  association: {
    id: string;
    name: string;
    logo: string;
    coverImage: string;
    category: string;
    foundedYear: number;
    location: string;
    website: string;
    email: string;
  };
  isFollowing: boolean;
  onFollowToggle: () => void;
}

const AssociationHeader = ({ association, isFollowing, onFollowToggle }: AssociationHeaderProps) => {
  return (
    <>
      {/* Hero Section with Cover Image */}
      <div className="relative h-[300px] md:h-[400px]">
        <img src={association.coverImage || '/placeholder.svg'} alt={`${association.name} cover`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

        {/* Back Button */}
        <div className="absolute left-4 top-4 z-10">
          <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm" asChild>
            <Link to="/associations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Association Header */}
        <div className="relative -mt-20 mb-8 flex flex-col items-start md:flex-row md:items-end">
          <div className="mr-6 h-32 w-32 overflow-hidden rounded-xl border-4 border-background bg-background shadow-lg">
            <img src={association.logo || '/placeholder.svg'} alt={association.name} className="h-full w-full object-cover" />
          </div>

          <div className="mt-4 flex-1 md:mt-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {association.category}
              </Badge>
              <Badge variant="outline" className="bg-muted">
                <Calendar className="mr-1 h-3 w-3" />
                Est. {association.foundedYear}
              </Badge>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{association.name}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200" />
                <span>{association.location}</span>
              </div>
              <div className="flex items-center ">
                <Mail className="mr-1 h-4 w-4 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200" />
                <span>{association.email}</span>
              </div>
              <div className="flex items-center">
                <Globe className="mr-1 h-4 w-4 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200" />
                <a href={association.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {association.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 md:mt-0">
            <Button onClick={onFollowToggle} variant={isFollowing ? 'outline' : 'default'} className={isFollowing ? 'border-primary text-primary' : ''}>
              {isFollowing ? (
                <>
                  <Heart className="mr-2 h-4 w-4 fill-primary" /> Following
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" /> Follow
                </>
              )}
            </Button>
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" /> Message
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Association</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssociationHeader;
