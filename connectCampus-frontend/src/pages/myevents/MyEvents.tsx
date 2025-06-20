import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@app/store/hooks';
import { profileCurrentProfileSelector } from '@app/store/selectors/profile-selectors';
import { getUserRegistrationsActionAsync } from '@app/store/actions/events/events-async-actions';
import FilterAndSearchControls from './components/FilterAndSearchControls';
import EventsList from './components/EventsList';
import { IEventSummaryResponse } from '@app/types/event/IEventResponse';
import { EventSummary, EventStatus } from '@app/types/event';
import { Button } from '@app/components/ui/button';
import { RefreshCw } from 'lucide-react';
import alertService from '@app/services/alert';
import { getEventAttendeesRequest } from '@app/api/requests/event-requests';

const MyEvents = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [attendeesCounts, setAttendeesCounts] = useState<Record<string, number>>({});

  const currentProfile = useSelector(profileCurrentProfileSelector);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchMyEvents = useCallback(
    async (showLoading = true) => {
      if (!currentProfile?.studentProfile?.id) {
        setIsLoading(false);
        return;
      }

      try {
        if (showLoading) setIsLoading(true);
        setError(null);

        // Fetch student's event registrations
        const result = await dispatch(
          getUserRegistrationsActionAsync({
            studentId: currentProfile.studentProfile.id,
            params: { page: 1, pageSize: 100 }, // Get all registrations
          }),
        ).unwrap();

        // Handle the response structure properly
        if (result && typeof result === 'object' && 'registrations' in result) {
          setRegistrations(result.registrations || []);
        } else if (Array.isArray(result)) {
          setRegistrations(result);
        } else {
          setRegistrations([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch student events:', err);
        const errorMessage = err?.message || 'Failed to load your event registrations. Please try again.';
        setError(errorMessage);
        setRegistrations([]);
        alertService.errorAlert({
          title: 'Error Loading Registrations',
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, currentProfile],
  );

  // Initial fetch
  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const fetchAttendeesCount = async (eventId: string) => {
    try {
      const attendees = await getEventAttendeesRequest(eventId);
      setAttendeesCounts(prev => ({ ...prev, [eventId]: attendees.length }));
    } catch (catched) {
      console.error(`Failed to fetch attendees for event ${eventId}:`, catched);
      setAttendeesCounts(prev => ({ ...prev, [eventId]: 0 }));
    }
  };

  const fetchAllAttendeesCounts = useCallback(async () => {
    if (registrations && registrations.length > 0) {
      const promises = registrations.map(reg => fetchAttendeesCount(reg.event.id));
      await Promise.all(promises);
    }
  }, [registrations]);

  // Fetch attendees counts when registrations change
  useEffect(() => {
    fetchAllAttendeesCounts();
  }, [fetchAllAttendeesCounts]);

  // Convert registrations to EventSummary format for display
  const events: EventSummary[] = registrations
    .map(reg => {
      const event = reg.event as IEventSummaryResponse;
      if (!event) return null;

      return {
        id: event.id,
        associationId: event.associationId,
        title: event.title || 'Untitled Event',
        slug: event.slug || event.id, // Use slug if available, fallback to ID
        description: event.description || '',
        coverImageUrl: event.coverImageUrl || '/placeholder-event.jpg',
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location || 'TBD',
        category: event.category || 'General',
        tags: event.tags || [],
        isFeatured: event.isFeatured || false,
        registrationRequired: event.registrationRequired || true,
        price: event.price || 0,
        isFree: event.isFree !== undefined ? event.isFree : true,
        status: event.status as any,
        attendeesCount: attendeesCounts[event.id] ?? 0,
        maxAttendees: event.maxAttendees || undefined,
        associationName: event.associationName || 'Unknown Association',
        associationLogo: event.associationLogo,
        type: event.type as any,
      } as EventSummary;
    })
    .filter(Boolean) as EventSummary[];

  // Helper function to determine if event is upcoming or past
  const isEventUpcoming = (event: EventSummary) => {
    const eventDate = new Date(event.startDate);
    const now = new Date();
    return eventDate > now;
  };

  const isEventPast = (event: EventSummary) => {
    // Past events are only those with Completed status
    return event.status === EventStatus.Completed;
  };

  // Filter events based on active tab and search term
  const filteredEvents = events
    .filter(event => {
      if (activeTab === 'all') return true;
      if (activeTab === 'upcoming') return isEventUpcoming(event);
      if (activeTab === 'past') return isEventPast(event);
      return true;
    })
    .filter(event => {
      if (!searchTerm) return true;
      return (
        (event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.associationName && event.associationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

  const handleRefresh = () => {
    fetchMyEvents(false); // Refresh without showing loading state
  };

  const handleRetry = () => {
    fetchMyEvents(true); // Retry with loading state
  };

  // Show loading state for profile if not loaded
  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show message if not a student
  if (!currentProfile.studentProfile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-4 px-3 md:px-4 max-w-7xl">
          <div className="text-center py-8">
            <h1 className="text-xl font-bold mb-3">Student Profile Required</h1>
            <p className="text-muted-foreground text-sm">You need a student profile to view your event registrations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className={`container mx-auto py-4 px-3 md:px-4 max-w-7xl relative transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Page Header */}
        <div
          className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">My Events</h1>
              <p className="text-muted-foreground text-sm">Manage your event registrations and attendance</p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="gap-2 h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <FilterAndSearchControls activeTab={activeTab} searchTerm={searchTerm} onTabChange={setActiveTab} onSearchChange={e => setSearchTerm(e.target.value)} />
          </div>

          <div className={`transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-3 text-sm">{error}</p>
                <Button onClick={handleRetry} variant="default" className="h-8 text-xs">
                  Try Again
                </Button>
              </div>
            ) : (
              <EventsList events={filteredEvents} isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;
