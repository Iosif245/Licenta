import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Calendar, Clock, Star, MapPin } from 'lucide-react';
import { EventType } from '@app/types/event';
import { EventSummary } from '@app/types/event';

interface EventHeaderProps {
  event: EventSummary;
}

const EventHeader = ({ event }: EventHeaderProps) => {
  const eventStartDate = event.startDate ? new Date(event.startDate) : new Date();
  const eventEndDate = event.endDate ? new Date(event.endDate) : new Date();

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case EventType.Workshop:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case EventType.Networking:
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case EventType.Conference:
        return 'bg-green-100 text-green-700 border-green-200';
      case EventType.Cultural:
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case EventType.Sports:
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Image */}
      <div className="relative rounded-xl overflow-hidden border border-border/40 bg-muted/30">
        <img src={event.coverImageUrl || '/placeholder-event.jpg'} alt={event.title || 'Event'} className="w-full h-64 md:h-80 object-cover" />

        {/* Status & Featured Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="secondary" className={`text-xs font-medium ${getTypeColor(event.type)}`}>
            {event.type || 'Event'}
          </Badge>
          {event.isFeatured && (
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4">
          <Badge
            variant={event.isFree ? 'secondary' : 'default'}
            className={`text-sm font-medium shadow-lg ${event.isFree ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}
          >
            {event.isFree ? 'Free' : `$${event.price || 0}`}
          </Badge>
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        {/* Category */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {event.category || 'General'}
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent py-2">
          {event.title || 'Untitled Event'}
        </h1>

        {/* Date & Time */}
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium">
              {event.startDate
                ? eventStartDate.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Date TBD'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" />
            <span className="font-medium">
              {event.startDate && event.endDate ? (
                <>
                  {eventStartDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                  {' - '}
                  {eventEndDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </>
              ) : (
                'Time TBD'
              )}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5 text-warning" />
          <span className="font-medium">{event.location || 'Location TBD'}</span>
        </div>

        {/* Association Info */}
        <div className="flex items-center gap-4 p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border/40">
          <Avatar className="h-12 w-12">
            <AvatarImage src={event.associationLogo} alt={event.associationName || 'Association'} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{(event.associationName || 'AS').substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Organized by</p>
            <Link to={`/associations/${event.associationId}`} className="text-lg font-semibold text-primary hover:underline transition-colors">
              {event.associationName || 'Unknown Association'}
            </Link>
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-muted/30 text-muted-foreground border-muted-foreground/20 hover:bg-muted/50 transition-colors">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventHeader;
