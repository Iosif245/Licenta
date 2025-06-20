import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { getEventsActionAsync, registerForEventActionAsync, unregisterFromEventActionAsync, addToFavoritesActionAsync, removeFromFavoritesActionAsync, getUserRegistrationsActionAsync, getUserFavoritesActionAsync } from '@app/store/actions/events/events-async-actions';
import { eventsListSelector, eventsLoadingSelector, eventsErrorSelector, eventsListPaginationSelector, userRegistrationsSelector, userFavoritesSelector } from '@app/store/selectors/events-selectors';

import { userIdSelector } from '@app/store/selectors/user-selectors';
import { Button } from '@app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Badge } from '@app/components/ui/badge';
import { Heart, Calendar, MapPin, Users, Clock, RefreshCw } from 'lucide-react';
import { IEventSummaryResponse } from '@app/types/event/IEventResponse';
import alertService from '@app/services/alert';

interface EventsListProps {
  showFilters?: boolean;
  showPagination?: boolean;
  limit?: number;
}

export const EventsList = ({ showFilters = true, showPagination = true, limit }: EventsListProps) => {
  const dispatch = useAppDispatch();

  const studentId = useAppSelector(userIdSelector);

  // Redux state
  const events = useAppSelector(eventsListSelector);
  const pagination = useAppSelector(eventsListPaginationSelector);
  const loading = useAppSelector(eventsLoadingSelector);
  const error = useAppSelector(eventsErrorSelector);
  const userRegistrations = useAppSelector(userRegistrationsSelector);
  const userFavorites = useAppSelector(userFavoritesSelector);

  // Local state for filters
  const [localFilters, setLocalFilters] = useState({
    category: '',
    type: '',
    featured: false,
    upcomingOnly: true,
  });

  const [registrationLoading, setRegistrationLoading] = useState<string | null>(null);
  const [favoritesLoading, setFavoritesLoading] = useState<string | null>(null);

  const fetchEventsData = useCallback(async (page = 1) => {
    try {
      await dispatch(getEventsActionAsync({
        page,
        pageSize: limit || 10,
        ...localFilters,
      })).unwrap();

      // Fetch user data if authenticated
      if (studentId) {
        await dispatch(getUserRegistrationsActionAsync({ studentId, params: {} })).unwrap();
        await dispatch(getUserFavoritesActionAsync({ studentId, params: {} })).unwrap();
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      alertService.errorAlert({
        title: 'Error Loading Events',
        message: 'Failed to load events. Please try again.',
      });
    }
  }, [dispatch, limit, localFilters, studentId]);

  // Fetch events on component mount
  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<typeof localFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
  };

  // Handle registration toggle
  const handleRegistrationToggle = async (eventId: string) => {
    if (!studentId) return;

    const isRegistered = userRegistrations.some(reg => reg.eventId === eventId);
    setRegistrationLoading(eventId);

    try {
      if (isRegistered) {
        await dispatch(unregisterFromEventActionAsync({ eventId, studentId })).unwrap();
        alertService.successAlert('Successfully unregistered from the event');
      } else {
        await dispatch(registerForEventActionAsync({ eventId, studentId })).unwrap();
        alertService.successAlert('Successfully registered for the event!');
      }

      // Refresh user registrations
      await dispatch(getUserRegistrationsActionAsync({ studentId, params: {} })).unwrap();
    } catch (error) {
      console.error('Registration error:', error);
      alertService.errorAlert({
        title: 'Registration Error',
        message: 'Failed to update registration. Please try again.',
      });
    } finally {
      setRegistrationLoading(null);
    }
  };

  // Handle favorites toggle
  const handleFavoritesToggle = async (eventId: string) => {
    if (!studentId) return;

    const isFavorited = userFavorites.some(fav => fav.eventId === eventId);
    setFavoritesLoading(eventId);

    try {
      if (isFavorited) {
        await dispatch(removeFromFavoritesActionAsync({ eventId, studentId })).unwrap();
        alertService.successAlert('Event removed from favorites');
      } else {
        await dispatch(addToFavoritesActionAsync({ eventId, studentId })).unwrap();
        alertService.successAlert('Event added to favorites!');
      }

      // Refresh user favorites
      await dispatch(getUserFavoritesActionAsync({ studentId, params: {} })).unwrap();
    } catch (error) {
      console.error('Favorites error:', error);
      alertService.errorAlert({
        title: 'Favorites Error',
        message: 'Failed to update favorites. Please try again.',
      });
    } finally {
      setFavoritesLoading(null);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchEventsData(page);
  };

  const handleRefresh = () => {
    fetchEventsData();
  };

  const isEventRegistered = (eventId: string) => {
    return userRegistrations.some(reg => reg.eventId === eventId);
  };

  const isEventFavorited = (eventId: string) => {
    return userFavorites.some(fav => fav.eventId === eventId);
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
          <select value={localFilters.category} onChange={e => handleFilterChange({ category: e.target.value })} className="px-3 py-2 border rounded-md">
            <option value="">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Workshop">Workshop</option>
            <option value="Conference">Conference</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
          </select>

          <select value={localFilters.type} onChange={e => handleFilterChange({ type: e.target.value })} className="px-3 py-2 border rounded-md">
            <option value="">All Types</option>
            <option value="In-Person">In-Person</option>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={localFilters.featured} onChange={e => handleFilterChange({ featured: e.target.checked })} />
            Featured Only
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={localFilters.upcomingOnly} onChange={e => handleFilterChange({ upcomingOnly: e.target.checked })} />
            Upcoming Only
          </label>

          <Button onClick={() => setLocalFilters({
            category: '',
            type: '',
            featured: false,
            upcomingOnly: true,
          })} variant="outline" size="sm">
            Clear Filters
          </Button>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isRegistered={isEventRegistered(event.id)}
            isFavorited={isEventFavorited(event.id)}
            onRegistrationToggle={() => handleRegistrationToggle(event.id)}
            onFavoritesToggle={() => handleFavoritesToggle(event.id)}
            registrationLoading={registrationLoading === event.id}
            favoritesLoading={favoritesLoading === event.id}
          />
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or check back later for new events.</p>
        </div>
      )}

      {/* Pagination */}
      {showPagination && pagination.totalCount > pagination.pageSize && (
        <div className="flex items-center justify-center gap-2">
          <Button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1} variant="outline" size="sm">
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {Math.ceil(pagination.totalCount / pagination.pageSize)}
          </span>

          <Button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil(pagination.totalCount / pagination.pageSize)}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

interface EventCardProps {
  event: IEventSummaryResponse;
  isRegistered: boolean;
  isFavorited: boolean;
  onRegistrationToggle: () => void;
  onFavoritesToggle: () => void;
  registrationLoading: boolean;
  favoritesLoading: boolean;
}

const EventCard = ({ event, isRegistered, isFavorited, onRegistrationToggle, onFavoritesToggle, registrationLoading, favoritesLoading }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Time TBD';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Cover Image */}
      {event.coverImageUrl && (
        <div className="aspect-video overflow-hidden">
          <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
          <Button onClick={onFavoritesToggle} disabled={favoritesLoading} variant="ghost" size="sm" className="shrink-0">
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{event.category}</Badge>
          <Badge variant="outline">{event.type}</Badge>
          {event.isFeatured && <Badge variant="default">Featured</Badge>}
          {event.isFree && <Badge variant="secondary">Free</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(event.startDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {event.attendeesCount}
              {event.maxAttendees && ` / ${event.maxAttendees}`} attendees
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={onRegistrationToggle} disabled={registrationLoading} variant={isRegistered ? 'outline' : 'default'} size="sm" className="flex-1">
            {isRegistered ? 'Unregister' : 'Register'}
          </Button>

          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
