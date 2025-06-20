import {
  getEventsRequest,
  getEventByIdRequest,
  getEventBySlugRequest,
  getFeaturedEventsRequest,
  getUpcomingEventsRequest,
  createEventRequest,
  updateEventRequest,
  deleteEventRequest,
  registerForEventRequest,
  unregisterFromEventRequest,
  getStudentEventRegistrationsRequest,
  addEventToFavoritesRequest,
  removeEventFromFavoritesRequest,
  getStudentFavoriteEventsRequest,
  getEventsByAssociationRequest,
  getEventsByCategoryRequest,
  getEventsByTypeRequest,
  checkEventRegistrationStatusRequest,
  checkEventFavoriteStatusRequest,
} from '@app/api/requests/event-requests';
import { CreateEventFormValues, UpdateEventFormValues } from '@app/schemas';
import {
  GET_EVENTS_ASYNC,
  GET_EVENT_BY_ID_ASYNC,
  GET_EVENT_BY_SLUG_ASYNC,
  GET_FEATURED_EVENTS_ASYNC,
  GET_UPCOMING_EVENTS_ASYNC,
  CREATE_EVENT_ASYNC,
  UPDATE_EVENT_ASYNC,
  DELETE_EVENT_ASYNC,
  REGISTER_FOR_EVENT_ASYNC,
  UNREGISTER_FROM_EVENT_ASYNC,
  GET_USER_REGISTRATIONS_ASYNC,
  ADD_TO_FAVORITES_ASYNC,
  REMOVE_FROM_FAVORITES_ASYNC,
  GET_USER_FAVORITES_ASYNC,
  CHECK_EVENT_REGISTRATION_STATUS_ASYNC,
  CHECK_EVENT_FAVORITE_STATUS_ASYNC,
} from '@app/store/constants';
import alertService from '@app/services/alert';
import ApiException from '@app/types/api/ApiException';

import { createAsyncThunk } from '@reduxjs/toolkit';

// Event CRUD Operations

/**
 * Get events with pagination and filters
 */
export const getEventsActionAsync = createAsyncThunk(
  GET_EVENTS_ASYNC,
  async (
    params: {
      page?: number;
      pageSize?: number;
      featured?: boolean;
      upcomingOnly?: boolean;
      category?: string;
      type?: string;
    } = {},
    { rejectWithValue: _rejectWithValue },
  ) => {
    try {
      const result = await getEventsRequest(params);
      return result;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

/**
 * Get single event by ID
 */
export const getEventByIdActionAsync = createAsyncThunk(GET_EVENT_BY_ID_ASYNC, async (eventId: string, { rejectWithValue: _rejectWithValue }) => {
  try {
    const result = await getEventByIdRequest(eventId);
    return result;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  }
});

/**
 * Get single event by slug
 */
export const getEventBySlugActionAsync = createAsyncThunk(GET_EVENT_BY_SLUG_ASYNC, async (eventSlug: string, { rejectWithValue: _rejectWithValue }) => {
  try {
    const result = await getEventBySlugRequest(eventSlug);
    return result;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  }
});

/**
 * Get featured events
 */
export const getFeaturedEventsActionAsync = createAsyncThunk(GET_FEATURED_EVENTS_ASYNC, async (params: { count?: number } = {}, { rejectWithValue: _rejectWithValue }) => {
  try {
    const result = await getFeaturedEventsRequest(params.count);
    return result.events;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  }
});

/**
 * Get upcoming events
 */
export const getUpcomingEventsActionAsync = createAsyncThunk(GET_UPCOMING_EVENTS_ASYNC, async (params: { count?: number } = {}, { rejectWithValue: _rejectWithValue }) => {
  try {
    const result = await getUpcomingEventsRequest(params.count);
    return result.events;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  }
});

/**
 * Create new event
 */
export const createEventActionAsync = createAsyncThunk(
  CREATE_EVENT_ASYNC,
  async ({ eventData, associationId }: { eventData: CreateEventFormValues; associationId: string }, { rejectWithValue: _rejectWithValue }) => {
    try {
      const result = await createEventRequest({ ...eventData, associationId });
      alertService.successAlert('Event created successfully!');
      return result;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

/**
 * Update existing event
 */
export const updateEventActionAsync = createAsyncThunk(
  UPDATE_EVENT_ASYNC,
  async ({ eventId, eventData }: { eventId: string; eventData: UpdateEventFormValues }, { rejectWithValue: _rejectWithValue }) => {
    try {
      await updateEventRequest(eventId, eventData);
      alertService.successAlert('Event updated successfully!');
      return eventId;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

/**
 * Delete event
 */
export const deleteEventActionAsync = createAsyncThunk(DELETE_EVENT_ASYNC, async (eventId: string, { rejectWithValue: _rejectWithValue }) => {
  try {
    await deleteEventRequest(eventId);
    alertService.successAlert('Event deleted successfully!');
    return eventId;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  }
});

// Event Registration Operations

/**
 * Register for an event
 */
export const registerForEventActionAsync = createAsyncThunk(
  REGISTER_FOR_EVENT_ASYNC,
  async ({ eventId, studentId }: { eventId: string; studentId: string }, { rejectWithValue: _rejectWithValue }) => {
    try {
      await registerForEventRequest(eventId, studentId);
      alertService.successAlert('Successfully registered for the event!');
      return { eventId, studentId };
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

/**
 * Unregister from an event
 */
export const unregisterFromEventActionAsync = createAsyncThunk(
  UNREGISTER_FROM_EVENT_ASYNC,
  async ({ eventId, studentId }: { eventId: string; studentId: string }, { rejectWithValue: _rejectWithValue }) => {
    try {
      await unregisterFromEventRequest(eventId, studentId);
      alertService.successAlert('Successfully unregistered from the event!');
      return { eventId, studentId };
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

/**
 * Get user's event registrations
 */
export const getUserRegistrationsActionAsync = createAsyncThunk(
  GET_USER_REGISTRATIONS_ASYNC,
  async (
    {
      studentId,
      params = {},
    }: {
      studentId: string;
      params?: { page?: number; pageSize?: number };
    },
    { rejectWithValue: _rejectWithValue },
  ) => {
    try {
      const result = await getStudentEventRegistrationsRequest(studentId, params);
      return result;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

// Event Favorites Operations

/**
 * Add event to favorites
 */
export const addToFavoritesActionAsync = createAsyncThunk(
  ADD_TO_FAVORITES_ASYNC,
  async ({ eventId, studentId }: { eventId: string; studentId: string }, { rejectWithValue: _rejectWithValue }) => {
    try {
      await addEventToFavoritesRequest(eventId, studentId);
      alertService.successAlert('Event added to favorites!');
      return { eventId, studentId };
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

/**
 * Remove event from favorites
 */
export const removeFromFavoritesActionAsync = createAsyncThunk(
  REMOVE_FROM_FAVORITES_ASYNC,
  async ({ eventId, studentId }: { eventId: string; studentId: string }, { rejectWithValue: _rejectWithValue }) => {
    try {
      await removeEventFromFavoritesRequest(eventId, studentId);
      alertService.successAlert('Event removed from favorites!');
      return { eventId, studentId };
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

/**
 * Get user's favorite events
 */
export const getUserFavoritesActionAsync = createAsyncThunk(
  GET_USER_FAVORITES_ASYNC,
  async (
    {
      studentId,
      params = {},
    }: {
      studentId: string;
      params?: { page?: number; pageSize?: number };
    },
    { rejectWithValue: _rejectWithValue },
  ) => {
    try {
      const result = await getStudentFavoriteEventsRequest(studentId, params);
      return result;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

// Additional utility actions

/**
 * Get events by association
 */
export const getEventsByAssociationActionAsync = createAsyncThunk(
  '[EVENTS] GET_BY_ASSOCIATION_ASYNC',
  async (
    {
      associationId,
      params = {},
    }: {
      associationId: string;
      params?: { upcomingOnly?: boolean };
    },
    { rejectWithValue: _rejectWithValue },
  ) => {
    try {
      console.log('🚀 getEventsByAssociationActionAsync - Making API call:', { associationId, params });
      const result = await getEventsByAssociationRequest(associationId, params);
      console.log('✅ getEventsByAssociationActionAsync - API Response:', result);
      console.log('📝 getEventsByAssociationActionAsync - Result type:', typeof result);
      console.log('📝 getEventsByAssociationActionAsync - Is array?', Array.isArray(result));

      // The API might return the array directly instead of wrapped in an object
      if (Array.isArray(result)) {
        const formattedResult = {
          events: result,
          page: 1,
          pageSize: result.length,
          totalCount: result.length,
        };
        console.log('🔄 getEventsByAssociationActionAsync - Formatted result:', formattedResult);
        return formattedResult;
      }

      return result;
    } catch (err) {
      console.error('❌ getEventsByAssociationActionAsync - Error:', err);
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

/**
 * Get events by category
 */
export const getEventsByCategoryActionAsync = createAsyncThunk(
  '[EVENTS] GET_BY_CATEGORY_ASYNC',
  async (
    {
      category,
      params = {},
    }: {
      category: string;
      params?: { page?: number; pageSize?: number };
    },
    { rejectWithValue: _rejectWithValue },
  ) => {
    try {
      const result = await getEventsByCategoryRequest(category, params);
      return result;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

/**
 * Get events by type
 */
export const getEventsByTypeActionAsync = createAsyncThunk(
  '[EVENTS] GET_BY_TYPE_ASYNC',
  async (
    {
      type,
      params = {},
    }: {
      type: string;
      params?: { page?: number; pageSize?: number };
    },
    { rejectWithValue: _rejectWithValue },
  ) => {
    try {
      const result = await getEventsByTypeRequest(type, params);
      return result;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

/**
 * Check if student is registered for an event
 */
export const checkEventRegistrationStatusActionAsync = createAsyncThunk(
  CHECK_EVENT_REGISTRATION_STATUS_ASYNC,
  async ({ eventId, studentId }: { eventId: string; studentId: string }, { rejectWithValue: _rejectWithValue }) => {
    try {
      const result = await checkEventRegistrationStatusRequest(eventId, studentId);
      return { eventId, studentId, isRegistered: result.isRegistered };
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

/**
 * Check if student has event in favorites
 */
export const checkEventFavoriteStatusActionAsync = createAsyncThunk(
  CHECK_EVENT_FAVORITE_STATUS_ASYNC,
  async ({ eventId, studentId }: { eventId: string; studentId: string }, { rejectWithValue: _rejectWithValue }) => {
    try {
      const result = await checkEventFavoriteStatusRequest(eventId, studentId);
      return { eventId, studentId, isFavorite: result.isFavorite };
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);
