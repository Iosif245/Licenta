import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import {
  getEventBySlugActionAsync,
  registerForEventActionAsync,
  unregisterFromEventActionAsync,
  addToFavoritesActionAsync,
  removeFromFavoritesActionAsync,
  checkEventRegistrationStatusActionAsync,
  checkEventFavoriteStatusActionAsync,
} from '@app/store/actions/events/events-async-actions';
import { selectedEventSelector, eventsLoadingSelector, eventsErrorSelector } from '@app/store/selectors/events-selectors';
import { userIdSelector, userRoleSelector } from '@app/store/selectors/user-selectors';
import { authStateSelector } from '@app/store/selectors/auth-selectors';
import EventHeader from './components/EventHeader';
import EventDescription from './components/EventDescription';
import EventSidebar from './components/EventSidebar';
import { Button } from '@app/components/ui/button';
import { Card, CardContent } from '@app/components/ui/card';
import { Skeleton } from '@app/components/ui/skeleton';
import { ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';
import { AuthState } from '@app/types/auth/IAuthState';
import { Roles } from '@app/types/user/Role';
import alertService from '@app/services/alert';
import { profileCurrentProfileSelector } from '@app/store/selectors/profile-selectors';
import { getEventAttendeesRequest } from '@app/api/requests/event-requests';

const EventDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [attendeesCount, setAttendeesCount] = useState<number | null>(null);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  // Local status state
  const [isUserRegistered, setIsUserRegistered] = useState<boolean | null>(null);
  const [isUserFavorited, setIsUserFavorited] = useState<boolean | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // User information
  const userId = useAppSelector(userIdSelector);
  const userRole = useAppSelector(userRoleSelector);
  const authState = useAppSelector(authStateSelector);
  const profile = useAppSelector(profileCurrentProfileSelector);
  const studentId = profile?.studentProfile?.id;

  // Redux state
  const event = useAppSelector(selectedEventSelector);
  const loading = useAppSelector(eventsLoadingSelector);
  const error = useAppSelector(eventsErrorSelector);

  // For debugging
  console.log('EventDetails - Debug Info:', {
    userId,
    userRole,
    studentId,
    profile,
    eventId: event?.id,
    isUserRegistered,
    isUserFavorited,
    statusLoading,
  });

  const fetchEventData = useCallback(async () => {
    if (!slug) return;

    try {
      await dispatch(getEventBySlugActionAsync(slug)).unwrap();
    } catch (cached) {
      console.error('Failed to fetch event:', cached);
    }
  }, [dispatch, slug]);

  const fetchAttendeesCount = useCallback(async () => {
    if (!event?.id) return;

    try {
      setAttendeesLoading(true);
      const attendees = await getEventAttendeesRequest(event.id);
      setAttendeesCount(attendees.length);
    } catch (catched) {
      console.error(`Failed to fetch attendees for event ${event.id}:`, catched);
      setAttendeesCount(0);
    } finally {
      setAttendeesLoading(false);
    }
  }, [event?.id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  useEffect(() => {
    fetchAttendeesCount();
  }, [fetchAttendeesCount]);

  // Function to check registration and favorite status
  const checkEventStatus = useCallback(async () => {
    if (!event?.id || !studentId) return;

    setStatusLoading(true);
    try {
      console.log('Checking event status for event:', event.id, 'student:', studentId);

      // Check registration status for internal registration events
      try {
        const registrationResult = await dispatch(
          checkEventRegistrationStatusActionAsync({
            eventId: event.id,
            studentId,
          }),
        ).unwrap();
        setIsUserRegistered(registrationResult.isRegistered);
        console.log('Registration status:', registrationResult.isRegistered);
      } catch (catched) {
        console.error('Failed to check registration status:', catched);
        setIsUserRegistered(false);
      }

      // Check favorite status (always available)
      try {
        const favoriteResult = await dispatch(
          checkEventFavoriteStatusActionAsync({
            eventId: event.id,
            studentId,
          }),
        ).unwrap();
        setIsUserFavorited(favoriteResult.isFavorite);
        console.log('Favorite status:', favoriteResult.isFavorite);
      } catch (catched) {
        console.error('Failed to check favorite status:', catched);
        setIsUserFavorited(false);
      }
    } finally {
      setStatusLoading(false);
    }
  }, [event?.id, studentId, dispatch]);

  // Check status once event is loaded
  useEffect(() => {
    if (event?.id && studentId) {
      checkEventStatus();
    }
  }, [event?.id, studentId, checkEventStatus]);

  // Check if user is logged in and can interact with events
  const isLoggedIn = authState === AuthState.LoggedIn;
  const canRegister = isLoggedIn && userRole === Roles.STUDENT && !!studentId;
  const canFavorite = isLoggedIn && userRole === Roles.STUDENT && !!studentId;

  // Status is managed locally now

  // Event status calculations
  const currentDate = new Date();
  const eventStartDate = event ? new Date(event.startDate) : new Date();
  const eventEndDate = event ? new Date(event.endDate) : new Date();

  const isEventFull = event?.maxAttendees ? (attendeesCount ?? 0) >= event.maxAttendees : false;
  const hasEventPassed = currentDate > eventEndDate;
  const isEventStarted = currentDate >= eventStartDate;

  console.log('Event interaction status:', {
    isUserRegistered,
    isUserFavorited,
    canRegister,
    canFavorite,
    isEventFull,
    hasEventPassed,
    isEventStarted,
  });

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/events');
    }
  };

  const handleRetry = () => {
    fetchEventData();
  };

  const handleRegister = async () => {
    console.log('🎯 handleRegister called with:', {
      event: event ? { id: event.id, title: event.title } : null,
      studentId,
      userId,
      canRegister,
      isLoggedIn,
      isUserRegistered,
      userRole,
    });

    if (!event) {
      console.error('❌ No event data available');
      return;
    }

    if (!isLoggedIn) {
      console.log('❌ User not logged in');
      alertService.errorAlert({
        title: 'Login Required',
        message: 'Please log in to register for events',
      });
      navigate('/login');
      return;
    }

    if (!studentId) {
      console.error('❌ No student ID available for logged in user', { userId, profile });
      alertService.errorAlert({
        title: 'Authentication Error',
        message: 'Unable to identify your student account. Please log out and log in again.',
      });
      return;
    }

    if (!canRegister) {
      console.log('❌ User cannot register', { userRole, isLoggedIn, studentId });
      alertService.errorAlert({
        title: 'Permission Denied',
        message: 'Only students can register for events',
      });
      return;
    }

    try {
      if (isUserRegistered) {
        console.log('🔄 Attempting to unregister from event', { eventId: event.id, studentId });
        await dispatch(unregisterFromEventActionAsync({ eventId: event.id, studentId })).unwrap();
        console.log('✅ Unregistration successful');
        alertService.successAlert('Successfully unregistered from the event');
      } else {
        console.log('🔄 Attempting to register for event', { eventId: event.id, studentId });
        await dispatch(registerForEventActionAsync({ eventId: event.id, studentId })).unwrap();
        console.log('✅ Registration successful');
        alertService.successAlert('Successfully registered for the event!');
      }

      // Refresh registration status and event data
      console.log('🔄 Refreshing status and event data');
      await checkEventStatus();
      await fetchAttendeesCount();
      await dispatch(getEventBySlugActionAsync(slug || event.id)).unwrap();
    } catch (catched) {
      console.error('❌ Registration error:', catched);

      // Extract detailed error information
      if (error && typeof error === 'object') {
        console.error('Error details:', {
          message: (error as any).message,
          response: (error as any).response,
          status: (error as any).status,
          data: (error as any).data,
        });
      }

      alertService.errorAlert({
        title: 'Registration Error',
        message: `Failed to update registration: ${(error as any)?.message || 'Unknown error'}`,
      });
    }
  };

  const handleShare = async () => {
    if (!event) return;

    const eventUrl = `${window.location.origin}/events/${event.slug}`;

    const handleCopyToClipboard = async (url: string) => {
      try {
        await navigator.clipboard.writeText(url);
        alertService.successAlert('Event link copied to clipboard!');
      } catch {
        alertService.errorAlert({
          title: 'Copy Failed',
          message: 'Failed to copy link to clipboard',
        });
      }
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: eventUrl,
        });
      } catch {
        // User cancelled or error occurred
        handleCopyToClipboard(eventUrl);
      }
    } else {
      handleCopyToClipboard(eventUrl);
    }
  };

  const handleSaveEvent = async () => {
    console.log('💖 handleSaveEvent called with:', {
      event: event ? { id: event.id, title: event.title } : null,
      studentId,
      userId,
      canFavorite,
      isLoggedIn,
      isUserFavorited,
    });

    if (!event) {
      console.error('❌ No event data available');
      return;
    }

    if (!isLoggedIn) {
      console.log('❌ User not logged in');
      alertService.errorAlert({
        title: 'Login Required',
        message: 'Please log in to save events to favorites',
      });
      navigate('/login');
      return;
    }

    if (!studentId) {
      console.error('❌ No student ID available for logged in user', { userId, profile });
      alertService.errorAlert({
        title: 'Authentication Error',
        message: 'Unable to identify your student account. Please log out and log in again.',
      });
      return;
    }

    if (!canFavorite) {
      console.log('❌ User cannot add to favorites', { userRole, isLoggedIn, studentId });
      alertService.errorAlert({
        title: 'Permission Denied',
        message: 'Only students can save events to favorites',
      });
      return;
    }

    try {
      if (isUserFavorited) {
        console.log('🔄 Attempting to remove event from favorites', { eventId: event.id, studentId });
        await dispatch(removeFromFavoritesActionAsync({ eventId: event.id, studentId })).unwrap();
        console.log('✅ Successfully removed from favorites');
      } else {
        console.log('🔄 Attempting to add event to favorites', { eventId: event.id, studentId });
        await dispatch(addToFavoritesActionAsync({ eventId: event.id, studentId })).unwrap();
        console.log('✅ Successfully added to favorites');
      }

      // Refresh favorite status
      console.log('🔄 Refreshing favorite status');
      await checkEventStatus();
    } catch (catched) {
      console.error('❌ Favorites error:', catched);

      // Extract detailed error information
      if (error && typeof error === 'object') {
        console.error('Error details:', {
          message: (error as any).message,
          response: (error as any).response,
          status: (error as any).status,
          data: (error as any).data,
        });
      }

      alertService.errorAlert({
        title: 'Favorites Error',
        message: `Failed to update favorites: ${(error as any)?.message || 'Unknown error'}`,
      });
    }
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Failed to Load Event</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRetry} variant="default" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading || !event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 md:px-4 py-4 max-w-7xl">
          <div className="mb-4">
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              <Skeleton className="h-[50vh] w-full mb-8 rounded-xl" />
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-8" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            <div>
              <Skeleton className="h-[60vh] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/3 rounded-full blur-3xl" />
      </div>

      <div className={`container mx-auto px-3 md:px-4 py-4 max-w-7xl relative transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Back button */}
        <div className="mb-4">
          <Button variant="ghost" onClick={handleGoBack} className="gap-2 hover:bg-secondary/80 transition-colors h-8 text-xs">
            <ArrowLeft className="h-3 w-3" />
            Back to Events
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className={`space-y-4 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {event && (
              <>
                <EventHeader
                  event={
                    {
                      ...event,
                      slug:
                        event.title
                          ?.toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[^a-z0-9-]/g, '') || event.id,
                      coverImageUrl: event.coverImageUrl || '/placeholder.svg?height=400&width=800',
                      associationLogo: event.associationLogo || '/placeholder.svg?height=40&width=40',
                    } as any
                  }
                />
                <EventDescription description={event.description} />
              </>
            )}
          </div>

          <div className={`lg:sticky lg:top-8 lg:self-start transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {event && (
              <EventSidebar
                event={
                  {
                    ...event,
                    slug:
                      event.title
                        ?.toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '') || event.id,
                    coverImageUrl: event.coverImageUrl || '/placeholder.svg?height=400&width=800',
                    associationLogo: event.associationLogo || '/placeholder.svg?height=40&width=40',
                  } as any
                }
                isRegistering={statusLoading}
                isSaving={statusLoading}
                isSaved={isUserFavorited ?? false}
                isRegistered={isUserRegistered ?? false}
                hasEventPassed={hasEventPassed}
                isEventStarted={isEventStarted}
                isEventFull={isEventFull}
                canRegister={canRegister}
                canFavorite={canFavorite}
                attendeesCount={attendeesCount}
                attendeesLoading={attendeesLoading}
                onRegister={handleRegister}
                onShare={handleShare}
                onSaveEvent={handleSaveEvent}
                isLoggedIn={isLoggedIn}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
