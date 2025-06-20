import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Input } from '@app/components/ui/input';
import { Heart, Calendar, MapPin, Users, Search, ExternalLink, Clock, RefreshCw, Sparkles, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IEventSummaryResponse } from '@app/types/event/IEventResponse';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { profileStudentSelector } from '@app/store/selectors/profile-selectors';
import { getUserFavoritesActionAsync, removeFromFavoritesActionAsync } from '@app/store/actions/events/events-async-actions';

import alertService from '@app/services/alert';
import { getEventAttendeesRequest } from '@app/api/requests/event-requests';

const FavoriteEvents = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendeesCounts, setAttendeesCounts] = useState<Record<string, number>>({});
  const [attendeesLoading, setAttendeesLoading] = useState<Record<string, boolean>>({});

  const studentProfile = useAppSelector(profileStudentSelector);
  const studentId = studentProfile?.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchFavorites = useCallback(
    async (showLoading = true) => {
      if (!studentId) {
        setIsLoading(false);
        return;
      }

      try {
        if (showLoading) setIsLoading(true);
        setError(null);

        const result = await dispatch(
          getUserFavoritesActionAsync({
            studentId,
            params: { page: 1, pageSize: 100 },
          }),
        ).unwrap();

        if (result && typeof result === 'object' && 'favorites' in result) {
          setFavorites(result.favorites || []);
        } else if (Array.isArray(result)) {
          setFavorites(result);
        } else {
          setFavorites([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch favorites:', err);
        const errorMessage = err?.message || 'Failed to load your favorite events. Please try again.';
        setError(errorMessage);
        setFavorites([]);
        alertService.errorAlert({
          title: 'Error Loading Favorites',
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, studentId],
  );

  // Initial fetch
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const fetchAttendeesCount = async (eventId: string) => {
    try {
      setAttendeesLoading(prev => ({ ...prev, [eventId]: true }));
      const attendees = await getEventAttendeesRequest(eventId);
      setAttendeesCounts(prev => ({ ...prev, [eventId]: attendees.length }));
    } catch (catched) {
      console.error(`Failed to fetch attendees for event ${eventId}:`, catched);
      setAttendeesCounts(prev => ({ ...prev, [eventId]: 0 }));
    } finally {
      setAttendeesLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const fetchAllAttendeesCounts = useCallback(async () => {
    const events = favorites;
    if (events && events.length > 0) {
      const promises = events.map(event => fetchAttendeesCount(event.event.id));
      await Promise.all(promises);
    }
  }, [favorites]);

  // Fetch attendees counts when favorite events change
  useEffect(() => {
    fetchAllAttendeesCounts();
  }, [fetchAllAttendeesCounts]);

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

  // Extract event data from favorites and filter
  const favoriteEvents = (favorites || []).map(fav => fav.event).filter(Boolean);
  const filteredEvents = favoriteEvents.filter((event: IEventSummaryResponse) => {
    const matchesSearch =
      (event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())) || (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRefresh = () => {
    fetchFavorites(false);
  };

  const handleRetry = () => {
    fetchFavorites(true);
  };

  const handleRemoveFromFavorites = async (eventId: string) => {
    if (!studentId) return;

    try {
      await dispatch(
        removeFromFavoritesActionAsync({
          eventId,
          studentId,
        }),
      ).unwrap();

      // Remove from local state immediately for better UX
      setFavorites(prev => prev.filter(fav => fav.eventId !== eventId));

      alertService.successAlert('Event removed from favorites');
    } catch (err: any) {
      console.error('Failed to remove from favorites:', err);
      alertService.errorAlert({
        title: 'Error',
        message: err?.message || 'Failed to remove event from favorites',
      });
    }
  };

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

  // Show loading state for profile if not loaded
  if (!studentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const EventCard = ({ event, index }: { event: IEventSummaryResponse; index: number }) => {
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    const handleFavoriteClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsFavoriteLoading(true);
      try {
        await handleRemoveFromFavorites(event.id);
      } finally {
        setIsFavoriteLoading(false);
      }
    };

    return (
      <div
        className="group relative bg-card/80 backdrop-blur-sm rounded-lg overflow-hidden border border-border/40 hover:shadow-md hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 ease-out hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4"
        style={{
          animationDelay: `${index * 100}ms`,
          animationFillMode: 'both',
        }}
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

          {/* Top right badges and controls - smaller */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            {/* Favorite Button (always filled since these are favorites) - smaller */}
            <button
              onClick={handleFavoriteClick}
              disabled={isFavoriteLoading}
              className={`w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 text-red-400 ${isFavoriteLoading ? 'animate-pulse' : ''}`}
            >
              <Heart className="h-3 w-3 fill-current transition-all duration-300" />
            </button>

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
            <Link to={`/events/${event.slug}`} className="flex-1">
              <Button size="sm" className="w-full h-7 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md text-xs">
                <ExternalLink className="h-2.5 w-2.5 mr-1" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const FavoritesSkeleton = () => (
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

  const ErrorState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Failed to Load Favorites</h3>
      <p className="text-muted-foreground mb-4">{error}</p>
      <Button onClick={handleRetry} variant="default">
        Try Again
      </Button>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-4">
        <Heart className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Favorite Events</h3>
      <p className="text-muted-foreground mb-4">You haven't added any events to your favorites yet. Start exploring events to find ones you like!</p>
      <Link to="/events">
        <Button variant="default">Explore Events</Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 max-w-7xl">
        {/* Header */}
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Favorite Events</h1>
              <p className="text-muted-foreground mt-1 text-sm">Events you've saved for later</p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2 h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
              <Input
                placeholder="Search favorite events..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-sm bg-card/80 backdrop-blur-sm border-border/40"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 h-8 text-sm rounded-md border border-border/40 bg-card/80 backdrop-blur-sm text-foreground"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className={`transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {error ? (
            <ErrorState />
          ) : isLoading ? (
            <FavoritesSkeleton />
          ) : filteredEvents.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteEvents;
