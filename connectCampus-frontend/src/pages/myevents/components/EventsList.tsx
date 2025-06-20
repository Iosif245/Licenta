import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EventSummary, EventStatus } from '@app/types/event';

interface EventsListProps {
  events: EventSummary[];
  isLoading: boolean;
}

const EventsList = ({ events, isLoading }: EventsListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      time: `${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })} - ${new Date(events.find(e => e.id === dateString)?.endDate || dateString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`,
    };
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.Published:
        return 'bg-green-100 text-green-700 border-green-200';
      case EventStatus.Draft:
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case EventStatus.Completed:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case EventStatus.Canceled:
        return 'bg-red-100 text-red-700 border-red-200';
      case EventStatus.Postponed:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'career':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'arts':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cultural':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'business':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'sports':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const isEventPast = (event: EventSummary) => {
    // Past events are only those with Completed status
    return event.status === EventStatus.Completed;
  };

  if (isLoading) {
    return (
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {[...Array(10)].map((_, index) => (
          <Card key={index} className="animate-pulse border-border/40 bg-card/80 backdrop-blur-sm rounded-lg">
            <div className="h-32 bg-muted/60 rounded-t-lg"></div>
            <CardHeader className="p-2">
              <div className="h-3 bg-muted/60 rounded w-3/4"></div>
              <div className="h-2 bg-muted/60 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1">
                <div className="h-2 bg-muted/60 rounded"></div>
                <div className="h-2 bg-muted/60 rounded"></div>
                <div className="h-2 bg-muted/60 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-card/50 rounded-2xl border border-border/50">
        <div className="max-w-md mx-auto space-y-4">
          <div
            className="w-16 h-16 mx-auto bg-gradient-to-tr from-primary/20 to-secondary/20 
            rounded-full flex items-center justify-center"
          >
            <Calendar className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">No events found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters to find events.</p>
          </div>

          <Button asChild className="h-8 text-xs">
            <Link to="/events" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300">
              Browse All Events
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {events.map((event, index) => {
        const eventDate = formatDate(event.startDate);
        const isPast = isEventPast(event);
        const [isHovered, setIsHovered] = useState(false);

        return (
          <Card
            key={event.id}
            className="group relative cursor-pointer border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-md hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden rounded-lg animate-in fade-in-0 slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Cover Image with Overlay - reduced height */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={event.coverImageUrl}
                alt={event.title}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPast ? 'opacity-75' : ''}`}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Badges - smaller */}
              <div className="absolute top-2 left-2 flex gap-1">
                <Badge variant="secondary" className={`text-[10px] font-medium px-1.5 py-0 ${getCategoryColor(event.category)}`}>
                  {event.category}
                </Badge>
                {event.isFeatured && (
                  <Badge className="bg-gradient-to-r from-warning to-accent text-white text-[10px] px-1.5 py-0 shadow-sm">
                    <Sparkles className="h-2 w-2 mr-0.5" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Price Badge - smaller */}
              <div className="absolute bottom-2 right-2">
                <Badge
                  variant={event.isFree ? 'secondary' : 'default'}
                  className={`text-[10px] font-medium shadow-sm px-1.5 py-0 ${event.isFree ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}
                >
                  {event.isFree ? 'Free' : `$${event.price}`}
                </Badge>
              </div>

              {/* Association Logo & Status Overlay - smaller */}
              <div className="absolute bottom-2 left-2 flex items-center gap-2">
                <Avatar className="h-6 w-6 border border-white/20 shadow-sm">
                  <AvatarImage src={event.associationLogo} alt={event.associationName} />
                  <AvatarFallback className="bg-white/10 text-white text-[10px] backdrop-blur-sm">{event.associationName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Badge variant="outline" className={`text-[10px] font-medium ${getStatusColor(event.status)} bg-white/20 text-white border-white/30 px-1.5 py-0`}>
                  {isPast ? 'Past' : event.status}
                </Badge>
              </div>
            </div>

            <CardHeader className="p-2 pb-1">
              <CardTitle className="text-sm line-clamp-2 group-hover:text-primary transition-colors duration-300">{event.title}</CardTitle>

              {/* Association Name - smaller */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground truncate">by {event.associationName}</span>
              </div>
            </CardHeader>

            <CardContent className="p-2 pt-0 space-y-2">
              {/* Event Details - more compact */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-1 h-2.5 w-2.5 text-primary" />
                  <span className="truncate text-[10px]">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-1 h-2.5 w-2.5 text-secondary" />
                  <span className="truncate text-[10px]">
                    {new Date(event.startDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-1 h-2.5 w-2.5 text-warning" />
                  <span className="line-clamp-1 text-[10px]">{event.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-1 h-2.5 w-2.5 text-accent" />
                  <span className="text-[10px]">
                    {event.attendeesCount} registered
                    {event.maxAttendees && ` of ${event.maxAttendees}`}
                  </span>
                </div>
              </div>

              {/* Tags - smaller */}
              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 2).map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="outline"
                      className="text-[9px] px-1 py-0 bg-muted/30 text-muted-foreground border-muted-foreground/20 hover:border-primary/50 transition-colors duration-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {event.tags.length > 2 && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 bg-muted/30 text-muted-foreground border-dashed">
                      +{event.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Footer - more compact */}
              <div className="flex items-center justify-between pt-1 border-t border-border/40">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className={`text-[9px] font-medium px-1 py-0 ${getStatusColor(event.status)}`}>
                    {event.type}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 transition-all duration-300 h-6 px-2 text-[10px]" asChild>
                  <Link to={`/events/${event.slug}`}>
                    <ExternalLink className="mr-0.5 h-2.5 w-2.5" />
                    View
                  </Link>
                </Button>
              </div>
            </CardContent>

            {/* Hover Effect Overlay */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default EventsList;
