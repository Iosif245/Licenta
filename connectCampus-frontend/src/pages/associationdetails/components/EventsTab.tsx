import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TabsContent } from '@app/components/ui/tabs';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ExternalLink, Search, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@app/components/ui/skeleton';
import { EventSummary, EventStatus } from '@app/types/event';
import { getEventAttendeesRequest } from '@app/api/requests/event-requests';

interface EventsTabProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeEventsTab: string;
  onEventsTabChange: (tab: string) => void;
  filteredUpcomingEvents: EventSummary[];
  filteredPastEvents: EventSummary[];
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  isAssociationMember?: boolean;
}

  const EventsTab = ({
  searchTerm,
  onSearchChange,
  activeEventsTab,
  onEventsTabChange,
  filteredUpcomingEvents,
  filteredPastEvents,
  formatDate,
  formatTime,
  isAssociationMember = false,
}: EventsTabProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [attendeesCounts, setAttendeesCounts] = useState<Record<string, number>>({});
  const [attendeesLoading, setAttendeesLoading] = useState<Record<string, boolean>>({});
  const [eventsLoading, setEventsLoading] = useState(false);

  const fetchAttendeesCount = async (eventId: string) => {
    try {
      setAttendeesLoading(prev => ({ ...prev, [eventId]: true }));
      const attendees = await getEventAttendeesRequest(eventId);
      setAttendeesCounts(prev => ({ ...prev, [eventId]: attendees.length }));
    } catch (error) {
      console.error(`Failed to fetch attendees for event ${eventId}:`, error);
      setAttendeesCounts(prev => ({ ...prev, [eventId]: 0 }));
    } finally {
      setAttendeesLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const fetchAllAttendeesCounts = useCallback(async () => {
    const allEvents = [...filteredUpcomingEvents, ...filteredPastEvents];
    if (allEvents && allEvents.length > 0) {
      setEventsLoading(true);
      try {
        const promises = allEvents.map(event => fetchAttendeesCount(event.id));
        await Promise.all(promises);
      } finally {
        setEventsLoading(false);
      }
    }
  }, [filteredUpcomingEvents, filteredPastEvents]);

  // Fetch attendees counts when events change
  useEffect(() => {
    fetchAllAttendeesCounts();
  }, [fetchAllAttendeesCounts]);

  const visibleUpcomingEvents = isAssociationMember ? filteredUpcomingEvents : filteredUpcomingEvents.filter(event => event.status !== EventStatus.Draft);

  const visiblePastEvents = isAssociationMember ? filteredPastEvents : filteredPastEvents.filter(event => event.status !== EventStatus.Draft);

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

  const EventCard = ({ event, isPast = false, index = 0 }: { event: EventSummary; isPast?: boolean; index?: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="group relative bg-card/80 backdrop-blur-sm rounded-lg overflow-hidden border border-border/40 hover:shadow-md hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 ease-out hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4"
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
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isPast ? 'opacity-75 grayscale-[0.3]' : ''}`}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Status Badge - smaller */}
          <Badge variant="secondary" className={`absolute top-2 left-2 text-xs font-medium ${getStatusColor(event.status)} px-1.5 py-0`}>
            {isPast ? 'Past Event' : event.status}
          </Badge>

          {/* Featured Badge - smaller */}
          {event.isFeatured && (
            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-warning to-accent text-white text-[10px] px-1.5 py-0 shadow-sm">
              <Sparkles className="h-2 w-2 mr-0.5" />
              Featured
            </Badge>
          )}

          {/* Price Badge - smaller */}
          <div className="absolute bottom-2 right-2">
            <Badge
              variant={event.isFree ? 'secondary' : 'default'}
              className={`text-[10px] font-medium shadow-sm px-1.5 py-0 ${event.isFree ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}
            >
              {event.isFree ? 'Free' : `$${event.price}`}
            </Badge>
          </div>

          {/* Event Title & Association Overlay - smaller text */}
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm line-clamp-1 mb-0.5">{event.title}</h3>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-[10px] px-1.5 py-0">
                {event.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Card Content - reduced padding */}
        <div className="p-2 space-y-2">
          {/* Event Description - shorter */}
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-1">{event.description}</p>

          {/* Event Details - more compact */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="truncate">{formatDate(event.startDate)}</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3 text-secondary flex-shrink-0" />
              <span className="truncate">{formatTime(event.startDate)}</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3 text-warning flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3 text-accent flex-shrink-0" />
              <span>
                {attendeesLoading[event.id] ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <>
                    {attendeesCounts[event.id] ?? 0} registered
                    {event.maxAttendees && ` of ${event.maxAttendees}`}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Tags - smaller */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 2).map((tag, tagIndex) => (
                <Badge
                  key={tagIndex}
                  variant="outline"
                  className="text-[10px] px-1 py-0 bg-muted/30 text-muted-foreground border-muted-foreground/20 hover:border-primary/50 transition-colors duration-200"
                >
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 2 && (
                <Badge variant="outline" className="text-[10px] px-1 py-0 bg-muted/30 text-muted-foreground border-dashed">
                  +{event.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Actions - smaller button */}
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1 h-7 text-xs bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-sm hover:shadow-md"
              asChild
            >
              <Link to={`/events/${event.slug}`}>
                <ExternalLink className="h-2.5 w-2.5 mr-1" />
                Details
              </Link>
            </Button>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5" />
        </div>
      </div>
    );
  };

  // Pagination handlers and calculations
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginateEvents = (events: EventSummary[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return events.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const totalPages = (events: EventSummary[]) => Math.ceil(events.length / ITEMS_PER_PAGE);
  const currentUpcomingEvents = paginateEvents(visibleUpcomingEvents);
  const currentPastEvents = paginateEvents(visiblePastEvents);
  const upcomingTotalPages = totalPages(visibleUpcomingEvents);
  const pastTotalPages = totalPages(visiblePastEvents);

  // Reset to first page when switching tabs or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeEventsTab, searchTerm]);

  const EventsSkeleton = () => (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-card/80 backdrop-blur-sm rounded-lg overflow-hidden border border-border/40">
          <Skeleton className="h-32 w-full" />
          <div className="p-2 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-7 w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  const Pagination = ({ totalPageCount }: { totalPageCount: number }) => {
    if (totalPageCount <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-sm">
          Page {currentPage} of {totalPageCount}
        </div>

        <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={currentPage === totalPageCount} onClick={() => handlePageChange(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <TabsContent value="events" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Events</h2>
        <div className="w-full max-w-xs">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full pl-7 pr-3 py-1.5 text-sm border border-border/60 rounded-lg bg-card/80 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="mb-3 flex space-x-2 border-b border-border/40">
          <button
            onClick={() => onEventsTabChange('upcoming')}
            className={`border-b-2 px-3 py-1.5 text-sm font-medium transition-colors ${
              activeEventsTab === 'upcoming' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => onEventsTabChange('past')}
            className={`border-b-2 px-3 py-1.5 text-sm font-medium transition-colors ${
              activeEventsTab === 'past' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
            }`}
          >
            Past Events
          </button>
        </div>

        {activeEventsTab === 'upcoming' && (
          <div className="mt-3">
            {eventsLoading ? (
              <EventsSkeleton />
            ) : visibleUpcomingEvents.length > 0 ? (
              <>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                  {currentUpcomingEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} isPast={false} index={index} />
                  ))}
                </div>
                <Pagination totalPageCount={upcomingTotalPages} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 p-6 text-center bg-muted/20">
                <Calendar className="mb-3 h-8 w-8 text-muted-foreground" />
                <h3 className="mb-1 text-md font-medium">No upcoming events</h3>
                <p className="text-xs text-muted-foreground max-w-md">
                  {searchTerm ? `No events matching "${searchTerm}"` : "This association doesn't have any upcoming events at the moment."}
                </p>
              </div>
            )}
          </div>
        )}

        {activeEventsTab === 'past' && (
          <div className="mt-3">
            {eventsLoading ? (
              <EventsSkeleton />
            ) : visiblePastEvents.length > 0 ? (
              <>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                  {currentPastEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} isPast={true} index={index} />
                  ))}
                </div>
                <Pagination totalPageCount={pastTotalPages} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 p-6 text-center bg-muted/20">
                <Calendar className="mb-3 h-8 w-8 text-muted-foreground" />
                <h3 className="mb-1 text-md font-medium">No past events</h3>
                <p className="text-xs text-muted-foreground max-w-md">{searchTerm ? `No events matching "${searchTerm}"` : "This association doesn't have any past events."}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default EventsTab;
