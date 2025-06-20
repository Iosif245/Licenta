import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Calendar, MapPin, Users, Clock, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { EventSummary } from '@app/types/event';

interface EventCardProps {
  event: EventSummary;
  viewMode?: 'grid' | 'list';
  hideHeart?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, viewMode = 'grid', hideHeart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Canceled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Postponed':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsFavoriteLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const startDateTime = formatDate(event.startDate);
  const attendancePercentage = event.maxAttendees ? (event.attendeesCount / event.maxAttendees) * 100 : 0;

  if (viewMode === 'list') {
    return (
      <Card
        className="group overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500 ease-out hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <div className="flex gap-6 p-6">
            {/* Event Image */}
            <div className="relative w-48 h-32 overflow-hidden bg-muted/30 rounded-xl">
              <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Status Badge */}
              <Badge variant="secondary" className={`absolute top-2 left-2 text-xs font-medium ${getStatusColor(event.status)}`}>
                {event.status}
              </Badge>

              {/* Featured Badge */}
              {event.isFeatured && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-warning to-accent text-white text-xs shadow-lg">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}

              {/* Price Badge */}
              <div className="absolute bottom-2 right-2">
                <Badge
                  variant={event.isFree ? 'secondary' : 'default'}
                  className={`text-xs font-medium shadow-md ${event.isFree ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}
                >
                  {event.isFree ? 'Free' : `$${event.price}`}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-lg leading-6 line-clamp-2 group-hover:text-primary transition-colors duration-300">{event.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs border-border/50 hover:border-primary/50 transition-colors duration-200">
                        {event.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-border/50 hover:border-primary/50 transition-colors duration-200">
                        {event.category}
                      </Badge>
                    </div>
                  </div>

                  {!hideHeart && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors duration-300"
                      onClick={handleFavoriteClick}
                      disabled={isFavoriteLoading}
                    >
                      <Heart className={`h-4 w-4 transition-all duration-300 ${event.isFeatured ? 'fill-current text-red-400' : ''} ${isFavoriteLoading ? 'animate-pulse' : ''}`} />
                    </Button>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{event.description}</p>

                {/* Event Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{startDateTime.date}</span>
                    <Clock className="h-4 w-4 text-secondary ml-2" />
                    <span>{startDateTime.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-accent" />
                    <span>
                      {event.attendeesCount} registered
                      {event.maxAttendees && ` / ${event.maxAttendees}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <MapPin className="h-4 w-4 text-warning" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* Tags */}
                {event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 4).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 bg-muted/30 border-border/50 hover:border-primary/50 transition-colors duration-200">
                        {tag}
                      </Badge>
                    ))}
                    {event.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted/30 border-dashed">
                        +{event.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={event.associationLogo} alt={event.associationName} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">{event.associationName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{event.associationName}</span>
                </div>

                <Button
                  size="sm"
                  className="h-9 px-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                  asChild
                >
                  <Link to={`/events/${event.slug}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Hover Effect Overlay */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5" />
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card
      className="group relative overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500 ease-out hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden bg-muted/30">
        <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Badge */}
        <Badge variant="secondary" className={`absolute top-3 left-3 text-xs font-medium ${getStatusColor(event.status)}`}>
          {event.status}
        </Badge>

        {/* Featured Badge */}
        {event.isFeatured && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-warning to-accent text-white text-xs shadow-lg">
            <Sparkles className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <Badge
            variant={event.isFree ? 'secondary' : 'default'}
            className={`text-xs font-medium shadow-md ${event.isFree ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}
          >
            {event.isFree ? 'Free' : `$${event.price}`}
          </Badge>
        </div>

        {/* Favorite Button */}
        {!hideHeart && (
          <button
            onClick={handleFavoriteClick}
            disabled={isFavoriteLoading}
            className={`absolute top-3 ${event.isFeatured ? 'right-20' : 'right-3'} w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 ${event.isFeatured ? 'text-red-400' : 'text-white'} ${isFavoriteLoading ? 'animate-pulse' : ''}`}
          >
            <Heart className={`h-4 w-4 transition-all duration-300 ${event.isFeatured ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Event Title & Association Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white/20 shadow-lg">
            <AvatarImage src={event.associationLogo} alt={event.associationName} />
            <AvatarFallback className="bg-white/10 text-white text-xs backdrop-blur-sm">{event.associationName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-1">
              {event.category}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Event Title & Type */}
        <div className="space-y-2 mb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-5 group-hover:text-primary transition-colors duration-300">{event.title}</h3>
          </div>
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs border-border/50 hover:border-primary/50 transition-colors duration-200">
              {event.type}
            </Badge>
          </div>
        </div>

        {/* Event Description */}
        <p className="text-muted-foreground text-xs line-clamp-2 mb-3 leading-relaxed">{event.description}</p>

        {/* Event Details */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>{startDateTime.date}</span>
            <Clock className="h-3.5 w-3.5 ml-1 text-secondary" />
            <span>{startDateTime.time}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-warning" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-accent" />
            <span>
              {event.attendeesCount} registered
              {event.maxAttendees && ` of ${event.maxAttendees}`}
            </span>
          </div>
        </div>

        {/* Attendance Progress */}
        {event.maxAttendees && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Registration</span>
              <span>{Math.round(attendancePercentage)}%</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {event.tags.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-0.5 bg-muted/30 text-muted-foreground border-muted-foreground/20 hover:border-primary/50 transition-colors duration-200"
              >
                {tag}
              </Badge>
            ))}
            {event.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted/30 text-muted-foreground border-dashed">
                +{event.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Organization */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground truncate">{event.associationName}</span>
          </div>

          <Button
            size="sm"
            className="h-7 px-3 text-xs bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md hover:shadow-lg transition-all duration-300"
            asChild
          >
            <Link to={`/events/${event.slug}`}>
              <ExternalLink className="h-3 w-3 mr-1" />
              View
            </Link>
          </Button>
        </div>
      </CardContent>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5" />
      </div>
    </Card>
  );
};

export default EventCard;
