import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { Card, CardContent } from '@app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Search, TrendingUp, Users, Calendar, Clock, AlertCircle, RefreshCw, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import alertService from '@app/services/alert';
import { Input } from '@app/components/ui/input';
import { Badge } from '@app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { IEventSummaryResponse } from '@app/types/event/IEventResponse';
import { getEventAttendeesRequest, getAllEventsRequest } from '@app/api/requests/event-requests';

const EventsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [attendeesCounts, setAttendeesCounts] = useState<Record<string, number>>({});
  const [attendeesLoading, setAttendeesLoading] = useState<Record<string, boolean>>({});

  // Local state for events
  const [events, setEvents] = useState<IEventSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use getAllEvents endpoint which returns only published events
      const allEvents = await getAllEventsRequest({
        featured: undefined, // Get all events, not just featured
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchTerm || undefined,
      });

      setEvents(allEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      const errorMessage = (error as any)?.message || 'Failed to load events. Please try again.';
      setError(errorMessage);
      alertService.errorAlert({
        title: 'Error Loading Events',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch events on mount and when page changes
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
    if (events && events.length > 0) {
      const promises = events.map(event => fetchAttendeesCount(event.id));
      await Promise.all(promises);
    }
  }, [events]);

  // Fetch attendees counts when events change
  useEffect(() => {
    fetchAllAttendeesCounts();
  }, [fetchAllAttendeesCounts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const categories = [
    'all',
    'Academic',
    'Workshop',
    'Conference',
    'Cultural',
    'Sports',
    'Technology',
    'Arts',
    'Business',
    'Science',
    'Social',
    'Environmental',
    'Healthcare',
    'Career',
    'Competition',
    'Other',
  ];

  // Show errors using alert service
  useEffect(() => {
    if (error) {
      alertService.errorAlert({
        title: 'Error Loading Events',
        message: error,
      });
    }
  }, [error]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // This will trigger fetchEvents due to the dependency
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // This will trigger fetchEvents due to the dependency
  };

  const handleRetry = () => {
    fetchEvents();
  };

  const handleRefresh = () => {
    fetchEvents();
  };

  // Since we get all events, we don't need client-side filtering
  const filteredEvents = events || [];

  // Calculate stats from all fetched events (all published events)
  const stats = {
    totalEvents: events?.length || 0,
    totalAttendees:
      events?.reduce((sum: number, event: IEventSummaryResponse) => {
        const count = attendeesCounts[event.id] ?? 0;
        return sum + count;
      }, 0) || 0,
    upcomingEvents:
      events?.filter((event: IEventSummaryResponse) => {
        if (!event.startDate) return false;
        const eventDate = new Date(event.startDate);
        const now = new Date();
        return eventDate > now; // Upcoming events
      }).length || 0,
    eventsThisMonth:
      events?.filter((event: IEventSummaryResponse) => {
        if (!event.startDate) return false;
        const eventDate = new Date(event.startDate);
        const now = new Date();
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
      }).length || 0,
  };

  // Loading skeleton component
  const EventsSkeleton = () => (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-card/80 backdrop-blur-sm rounded-lg overflow-hidden border border-border/40 animate-pulse">
          <div className="h-32 bg-muted" />
          <div className="p-2 space-y-2">
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-2 bg-muted rounded w-1/2" />
            <div className="h-2 bg-muted rounded w-full" />
            <div className="h-2 bg-muted rounded w-2/3" />
            <div className="h-6 bg-muted rounded w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );

  // Stats cards component
  const StatsCards = () => (
    <div className="grid gap-3 md:grid-cols-4 mb-6">
      <Card className="border-border/40 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <div>
              <div className="text-lg font-semibold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Total Events</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-gradient-to-br from-secondary/5 to-secondary/10">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-secondary" />
            <div>
              <div className="text-lg font-semibold">{stats.totalAttendees}</div>
              <p className="text-xs text-muted-foreground">Total Attendees</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-gradient-to-br from-accent/5 to-accent/10">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-accent" />
            <div>
              <div className="text-lg font-semibold">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-gradient-to-br from-warning/5 to-warning/10">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-warning" />
            <div>
              <div className="text-lg font-semibold">{stats.eventsThisMonth}</div>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Modern event card component (like FavoriteEvents but without heart)
  const EventCard = ({ event, index = 0 }: { event: IEventSummaryResponse; index?: number }) => {
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
            src={event.coverImageUrl || '/placeholder-event.jpg'}
            alt={event.title || 'Event'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category Badge - smaller */}
          <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] font-medium bg-primary/90 text-primary-foreground px-1.5 py-0">
            {event.category || 'General'}
          </Badge>

          {/* Top right badges (without heart) - smaller */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            {/* Featured Badge - smaller */}
            {event.isFeatured && (
              <Badge className="bg-gradient-to-r from-warning to-accent text-white text-[10px] shadow-lg px-1.5 py-0">
                <Sparkles className="h-2 w-2 mr-0.5" />
                Featured
              </Badge>
            )}
          </div>

          {/* Price Badge - smaller */}
          <div className="absolute bottom-2 right-2">
            <Badge
              variant={event.isFree ? 'secondary' : 'default'}
              className={`text-[10px] font-medium shadow-md px-1.5 py-0 ${event.isFree ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}
            >
              {event.isFree ? 'Free' : `$${event.price || 0}`}
            </Badge>
          </div>

          {/* Event Title & Association Overlay - smaller */}
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-white/20 shadow-lg">
              <AvatarImage src={event.associationLogo} alt={event.associationName || 'Association'} />
              <AvatarFallback className="bg-white/10 text-white text-[10px] backdrop-blur-sm">{(event.associationName || 'AS').substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-[10px] px-1.5 py-0">
                {event.type || 'Event'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Card Content - reduced padding */}
        <div className="p-2 space-y-2">
          {/* Event Title - smaller */}
          <h3 className="font-semibold text-foreground line-clamp-1 text-sm leading-4 group-hover:text-primary transition-colors duration-300">
            {event.title || 'Untitled Event'}
          </h3>

          {/* Association Name - smaller */}
          <p className="text-xs text-muted-foreground">by {event.associationName || 'Unknown Association'}</p>

          {/* Event Description - shorter */}
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-1">{event.description || 'No description available.'}</p>

          {/* Event Details - more compact */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="truncate">{event.startDate ? formatDate(event.startDate) : 'Date TBD'}</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3 text-secondary flex-shrink-0" />
              <span className="truncate">{event.startDate && event.endDate ? `${formatTime(event.startDate)} - ${formatTime(event.endDate)}` : 'Time TBD'}</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3 text-warning flex-shrink-0" />
              <span className="line-clamp-1">{event.location || 'Location TBD'}</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3 text-accent flex-shrink-0" />
              <span className="truncate">{attendeesLoading[event.id] ? <span className="animate-pulse">...</span> : `${attendeesCounts[event.id] ?? 0} registered`}</span>
            </div>
          </div>

          {/* Action Buttons - smaller */}
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="w-full h-7 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md text-xs"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                // Navigation will be handled by the parent Link
              }}
            >
              <ExternalLink className="h-2.5 w-2.5 mr-1" />
              View Details
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

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/3 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 max-w-md relative">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-destructive">Failed to Load Events</h2>
                <p className="text-muted-foreground">There was an error loading the events. Please try again.</p>
              </div>
              <Button onClick={handleRetry} variant="default" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 md:px-4 py-4 max-w-7xl">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Campus Events</h1>
            <p className="text-muted-foreground mt-1 text-sm">Discover exciting events happening across campus. Join workshops, conferences, and social gatherings.</p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2 h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Search and Filter */}
        <div className={`flex flex-col sm:flex-row gap-3 mb-6 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search events..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="pl-8 h-8 text-sm" />
          </div>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-48 h-8 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category} className="text-sm">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <StatsCards />
        </div>

        {/* Results Header */}
        {!loading && filteredEvents && filteredEvents.length > 0 && (
          <div className={`mb-6 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredEvents.length}</span> of <span className="font-medium text-foreground">{events.length}</span> events
                {searchTerm && (
                  <>
                    {' '}
                    for "<span className="font-medium text-foreground">{searchTerm}</span>"
                  </>
                )}
                {selectedCategory !== 'all' && (
                  <>
                    {' '}
                    in <span className="font-medium text-foreground">{selectedCategory}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className={`transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {loading ? (
            <EventsSkeleton />
          ) : filteredEvents && filteredEvents.length > 0 ? (
            <>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredEvents.map((event: IEventSummaryResponse, index: number) => (
                  <Link key={event.id} to={`/events/${event.slug}`} className="no-underline">
                    <EventCard event={event} index={index} />
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedCategory !== 'all'
                    ? `No events match your current filters. Try different search terms or categories.`
                    : 'No events are currently available. Check back later for new events!'}
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleSearch('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
