import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import {
  // Async actions
  getEventsActionAsync,
  getEventByIdActionAsync,
  getFeaturedEventsActionAsync,
  getUpcomingEventsActionAsync,
  createEventActionAsync,
  updateEventActionAsync,
  deleteEventActionAsync,
  registerForEventActionAsync,
  unregisterFromEventActionAsync,
  getUserRegistrationsActionAsync,
  addToFavoritesActionAsync,
  removeFromFavoritesActionAsync,
  getUserFavoritesActionAsync,
} from '@app/store/actions/events/events-async-actions';
import {
  // Sync actions
  setEventFiltersAction,
  clearEventFiltersAction,
  clearEventsErrorAction,
  clearRegistrationErrorAction,
  clearFavoritesErrorAction,
} from '@app/store/actions/events/events-sync-actions';
import {
  // Selectors
  eventsPageStateSelector,
  selectedEventSelector,
  featuredEventsSelector,
  upcomingEventsSelector,
  userEventsStateSelector,
  eventDetailStateSelector,

  getEventByIdSelector,
} from '@app/store/selectors/events-selectors';
import { CreateEventFormValues, UpdateEventFormValues } from '@app/schemas';
import { IEventFilters } from '@app/types/event/IEventResponse';

export function useEvents() {
  const dispatch = useAppDispatch();
  const eventsPageState = useAppSelector(eventsPageStateSelector);
  const featuredEvents = useAppSelector(featuredEventsSelector);
  const upcomingEvents = useAppSelector(upcomingEventsSelector);

  // Fetch events with filters
  const fetchEvents = useCallback(
    (params?: { page?: number; pageSize?: number; featured?: boolean; upcomingOnly?: boolean; category?: string; type?: string }) => {
      dispatch(getEventsActionAsync(params));
    },
    [dispatch],
  );

  // Fetch featured events
  const fetchFeaturedEvents = useCallback(
    (count?: number) => {
      dispatch(getFeaturedEventsActionAsync({ count }));
    },
    [dispatch],
  );

  // Fetch upcoming events
  const fetchUpcomingEvents = useCallback(
    (count?: number) => {
      dispatch(getUpcomingEventsActionAsync({ count }));
    },
    [dispatch],
  );

  // Set filters
  const setFilters = useCallback(
    (filters: Partial<IEventFilters>) => {
      dispatch(setEventFiltersAction(filters));
    },
    [dispatch],
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    dispatch(clearEventFiltersAction());
  }, [dispatch]);

  // Clear errors
  const clearError = useCallback(() => {
    dispatch(clearEventsErrorAction());
  }, [dispatch]);

  return {
    // State
    events: eventsPageState.events,
    pagination: eventsPageState.pagination,
    loading: eventsPageState.loading,
    error: eventsPageState.error,
    filters: eventsPageState.filters,
    featuredEvents,
    upcomingEvents,

    // Actions
    fetchEvents,
    fetchFeaturedEvents,
    fetchUpcomingEvents,
    setFilters,
    clearFilters,
    clearError,
  };
}

export function useEventDetail(eventId?: string) {
  const dispatch = useAppDispatch();
  const eventDetailState = useAppSelector(eventDetailStateSelector);
  const selectedEvent = useAppSelector(selectedEventSelector);

  // Get event from list if available
  const eventFromList = useAppSelector(state => (eventId ? getEventByIdSelector(state, eventId) : null));

  // Fetch event by ID
  const fetchEvent = useCallback(
    (id: string) => {
      dispatch(getEventByIdActionAsync(id));
    },
    [dispatch],
  );

  // Auto-fetch event when eventId changes
  useEffect(() => {
    if (eventId && (!selectedEvent || selectedEvent.id !== eventId)) {
      fetchEvent(eventId);
    }
  }, [eventId, selectedEvent, fetchEvent]);

  return {
    // State
    event: selectedEvent || eventFromList,
    loading: eventDetailState.loading,
    error: eventDetailState.error,

    // Actions
    fetchEvent,
  };
}

export function useEventRegistration(studentId?: string) {
  const dispatch = useAppDispatch();
  const userEventsState = useAppSelector(userEventsStateSelector);

  // Check if event is registered - moved useAppSelector to top level
  const isEventRegistered = useCallback((eventId: string) => {
    // This will be handled by a selector that takes eventId as parameter
    const state = userEventsState.registrations.data;
    return state.some(registration => registration.eventId === eventId);
  }, [userEventsState.registrations.data]);

  // Register for event
  const registerForEvent = useCallback(
    (eventId: string) => {
      if (!studentId) return;
      dispatch(registerForEventActionAsync({ eventId, studentId }));
    },
    [dispatch, studentId],
  );

  // Unregister from event
  const unregisterFromEvent = useCallback(
    (eventId: string) => {
      if (!studentId) return;
      dispatch(unregisterFromEventActionAsync({ eventId, studentId }));
    },
    [dispatch, studentId],
  );

  // Fetch user registrations
  const fetchUserRegistrations = useCallback(
    (params?: { page?: number; pageSize?: number }) => {
      if (!studentId) return;
      dispatch(getUserRegistrationsActionAsync({ studentId, params }));
    },
    [dispatch, studentId],
  );

  // Clear registration error
  const clearRegistrationError = useCallback(() => {
    dispatch(clearRegistrationErrorAction());
  }, [dispatch]);

  return {
    // State
    registrations: userEventsState.registrations.data,
    registrationsPagination: userEventsState.registrations.pagination,
    registrationLoading: userEventsState.registrations.loading,
    registrationError: userEventsState.registrations.error,

    // Actions
    registerForEvent,
    unregisterFromEvent,
    fetchUserRegistrations,
    clearRegistrationError,
    isEventRegistered,
  };
}

export function useEventFavorites(studentId?: string) {
  const dispatch = useAppDispatch();
  const userEventsState = useAppSelector(userEventsStateSelector);

  // Check if event is favorited - moved useAppSelector to top level
  const isEventFavorited = useCallback((eventId: string) => {
    // This will be handled by checking the favorites data
    const state = userEventsState.favorites.data;
    return state.some(favorite => favorite.eventId === eventId);
  }, [userEventsState.favorites.data]);

  // Add to favorites
  const addToFavorites = useCallback(
    (eventId: string) => {
      if (!studentId) return;
      dispatch(addToFavoritesActionAsync({ eventId, studentId }));
    },
    [dispatch, studentId],
  );

  // Remove from favorites
  const removeFromFavorites = useCallback(
    (eventId: string) => {
      if (!studentId) return;
      dispatch(removeFromFavoritesActionAsync({ eventId, studentId }));
    },
    [dispatch, studentId],
  );

  // Fetch user favorites
  const fetchUserFavorites = useCallback(
    (params?: { page?: number; pageSize?: number }) => {
      if (!studentId) return;
      dispatch(getUserFavoritesActionAsync({ studentId, params }));
    },
    [dispatch, studentId],
  );

  // Clear favorites error
  const clearFavoritesError = useCallback(() => {
    dispatch(clearFavoritesErrorAction());
  }, [dispatch]);

  return {
    // State
    favorites: userEventsState.favorites.data,
    favoritesPagination: userEventsState.favorites.pagination,
    favoritesLoading: userEventsState.favorites.loading,
    favoritesError: userEventsState.favorites.error,

    // Actions
    addToFavorites,
    removeFromFavorites,
    fetchUserFavorites,
    clearFavoritesError,
    isEventFavorited,
  };
}

export function useEventManagement() {
  const dispatch = useAppDispatch();
  const eventsPageState = useAppSelector(eventsPageStateSelector);

  // Create event
  const createEvent = useCallback(
    async (eventData: CreateEventFormValues, associationId: string) => {
      const result = await dispatch(createEventActionAsync({ eventData, associationId }));
      if (createEventActionAsync.fulfilled.match(result)) {
        return result.payload;
      } else {
        throw new Error(result.error?.message || 'Failed to create event');
      }
    },
    [dispatch],
  );

  // Update event
  const updateEvent = useCallback(
    async (eventId: string, eventData: UpdateEventFormValues) => {
      const result = await dispatch(updateEventActionAsync({ eventId, eventData }));
      if (updateEventActionAsync.fulfilled.match(result)) {
        return result.payload;
      } else {
        throw new Error(result.error?.message || 'Failed to update event');
      }
    },
    [dispatch],
  );

  // Delete event
  const deleteEvent = useCallback(
    async (eventId: string) => {
      const result = await dispatch(deleteEventActionAsync(eventId));
      if (deleteEventActionAsync.fulfilled.match(result)) {
        return result.payload;
      } else {
        throw new Error(result.error?.message || 'Failed to delete event');
      }
    },
    [dispatch],
  );

  // Clear errors
  const clearError = useCallback(() => {
    dispatch(clearEventsErrorAction());
  }, [dispatch]);

  return {
    // State
    loading: eventsPageState.loading,
    error: eventsPageState.error,

    // Actions
    createEvent,
    updateEvent,
    deleteEvent,
    clearError,
  };
}
