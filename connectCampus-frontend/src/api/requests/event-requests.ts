import { AxiosResponse } from 'axios';
import { getApi } from '../index';
import IEventResponse, { IEventsListResponse, IEventRegistrationResponse, IEventFavoriteResponse, IEventSummaryResponse } from '@app/types/event/IEventResponse';
import { CreateEventFormValues, UpdateEventFormValues } from '@app/schemas';

// Event CRUD Operations

/**
 * Get all events with optional filtering
 */
export const getEventsRequest = async (params?: {
  page?: number;
  pageSize?: number;
  featured?: boolean;
  upcomingOnly?: boolean;
  category?: string;
  type?: string;
}): Promise<IEventsListResponse> => {
  const response: AxiosResponse<IEventsListResponse> = await getApi().get('/api/events', { params });
  return response.data;
};

/**
 * Get event by ID
 */
export const getEventByIdRequest = async (id: string): Promise<IEventResponse> => {
  const response: AxiosResponse<IEventResponse> = await getApi().get(`/api/events/${id}`);
  return response.data;
};

/**
 * Get event by slug
 */
export const getEventBySlugRequest = async (slug: string): Promise<IEventResponse> => {
  const response: AxiosResponse<IEventResponse> = await getApi().get(`/api/events/slug/${slug}`);
  return response.data;
};

/**
 * Get events by association
 */
export const getEventsByAssociationRequest = async (
  associationId: string,
  params?: {
    upcomingOnly?: boolean;
    includeAllStatuses?: boolean;
  },
): Promise<IEventsListResponse> => {
  const response: AxiosResponse<IEventsListResponse> = await getApi().get(`/api/events/association/${associationId}`, { params });
  return response.data;
};

/**
 * Get featured events
 */
export const getFeaturedEventsRequest = async (count?: number): Promise<IEventsListResponse> => {
  const response: AxiosResponse<IEventsListResponse> = await getApi().get('/api/events/featured', {
    params: { count },
  });
  return response.data;
};

/**
 * Get upcoming events
 */
export const getUpcomingEventsRequest = async (count?: number): Promise<IEventsListResponse> => {
  const response: AxiosResponse<IEventsListResponse> = await getApi().get('/api/events/upcoming', {
    params: { count },
  });
  return response.data;
};

/**
 * Create a new event
 */
export const createEventRequest = async (data: CreateEventFormValues & { associationId: string }): Promise<{ id: string }> => {
  const formData = new FormData();

  // Add all form fields to FormData - match backend CreateEventRequest exactly
  formData.append('associationId', data.associationId);
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('startDate', data.startDate.toISOString());
  formData.append('endDate', data.endDate.toISOString());
  formData.append('timezone', data.timezone);
  formData.append('location', data.location);
  formData.append('category', data.category);
  formData.append('capacity', data.capacity.toString());
  formData.append('isPublic', data.isPublic.toString());
  formData.append('isFeatured', (data.isFeatured || false).toString());
  formData.append('registrationRequired', data.registrationRequired.toString());
  formData.append('isFree', data.isFree.toString());
  formData.append('status', data.status || 'Draft');
  formData.append('type', data.type);

  // Required field - contact email
  formData.append('contactEmail', data.contactEmail || '');

  // Optional fields that can be null/undefined
  if (data.maxAttendees !== undefined && data.maxAttendees !== null) {
    formData.append('maxAttendees', data.maxAttendees.toString());
  }

  if (data.registrationDeadline) {
    formData.append('registrationDeadline', data.registrationDeadline.toISOString());
  }

  if (data.registrationUrl && data.registrationUrl.trim() !== '') {
    formData.append('registrationUrl', data.registrationUrl);
  }

  if (data.price !== undefined && data.price !== null) {
    formData.append('price', data.price.toString());
  }

  if (data.paymentMethod && data.paymentMethod.trim() !== '') {
    formData.append('paymentMethod', data.paymentMethod);
  }

  // Tags array - send as individual entries, not as single JSON string
  if (data.tags && data.tags.length > 0) {
    data.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });
  }

  // Add cover image file if provided
  if (data.coverImage) {
    formData.append('coverImage', data.coverImage);
  }

  const response: AxiosResponse<{ id: string }> = await getApi().post('/api/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update an existing event
 */
export const updateEventRequest = async (id: string, data: UpdateEventFormValues): Promise<void> => {
  try {
    const formData = new FormData();

    // Add all form fields to FormData
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('startDate', data.startDate ? data.startDate.toISOString() : '');
    formData.append('endDate', data.endDate ? data.endDate.toISOString() : '');
    formData.append('timezone', data.timezone);
    formData.append('location', data.location);
    formData.append('category', data.category);
    formData.append('capacity', data.capacity.toString());
    formData.append('isPublic', data.isPublic.toString());
    formData.append('isFeatured', (data.isFeatured || false).toString());
    formData.append('registrationRequired', data.registrationRequired.toString());
    formData.append('isFree', data.isFree.toString());
    formData.append('status', data.status || 'Draft');
    formData.append('type', data.type);

    // Optional fields
    if (data.contactEmail) {
      formData.append('contactEmail', data.contactEmail);
    }

    if (data.maxAttendees !== undefined && data.maxAttendees !== null) {
      formData.append('maxAttendees', data.maxAttendees.toString());
    }

    if (data.registrationDeadline) {
      formData.append('registrationDeadline', data.registrationDeadline.toISOString());
    }

    if (data.registrationUrl) {
      formData.append('registrationUrl', data.registrationUrl);
    }

    if (data.price !== undefined && data.price !== null) {
      formData.append('price', data.price.toString());
    }

    if (data.paymentMethod) {
      formData.append('paymentMethod', data.paymentMethod);
    }

    // Tags array - send as individual entries, not as single JSON string
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    }

    // Add cover image file if provided
    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }

    const response = await getApi().put(`/api/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status !== 204) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Update failed:', error);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('Request was made but no response received');
    } else {
      console.error('Error setting up request:', error.message);
    }

    const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to update event';
    throw new Error(errorMessage);
  }
};

/**
 * Delete an event
 */
export const deleteEventRequest = async (id: string): Promise<void> => {
  await getApi().delete(`/api/events/${id}`);
};

// Event Registration Operations

/**
 * Register for an event
 */
export const registerForEventRequest = async (eventId: string, studentId: string): Promise<void> => {
  try {
    console.log('🚀 registerForEventRequest - Making API call:', { eventId, studentId });

    const response = await getApi().post(
      `/api/events/${eventId}/register`,
      {
        studentId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('✅ registerForEventRequest - Success:', response.status);
    console.log('📝 registerForEventRequest - Response:', response.data);
  } catch (error: any) {
    console.error('❌ registerForEventRequest - Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request was made but no response received');
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

/**
 * Unregister from an event
 */
export const unregisterFromEventRequest = async (eventId: string, studentId: string): Promise<void> => {
  try {
    console.log('🚀 unregisterFromEventRequest - Making API call:', { eventId, studentId });

    const response = await getApi().delete(`/api/events/${eventId}/register`, {
      data: { studentId },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ unregisterFromEventRequest - Success:', response.status);
    console.log('📝 unregisterFromEventRequest - Response:', response.data);
  } catch (error: any) {
    console.error('❌ unregisterFromEventRequest - Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request was made but no response received');
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

/**
 * Get student's event registrations
 */
export const getStudentEventRegistrationsRequest = async (
  studentId: string,
  params?: {
    page?: number;
    pageSize?: number;
  },
): Promise<{ registrations: IEventRegistrationResponse[]; totalCount: number; page: number; pageSize: number }> => {
  try {
    console.log('🚀 getStudentEventRegistrationsRequest - Making API call:', { studentId, params });

    const response: AxiosResponse<{
      registrations: IEventRegistrationResponse[];
      totalCount: number;
      page: number;
      pageSize: number;
    }> = await getApi().get(`/api/events/registrations/student/${studentId}`, { params });

    console.log('✅ getStudentEventRegistrationsRequest - Success:', response.status);
    console.log('📝 getStudentEventRegistrationsRequest - Response data count:', response.data?.registrations?.length || 0);

    return response.data;
  } catch (error: any) {
    console.error('❌ getStudentEventRegistrationsRequest - Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

// Event Favorites Operations

/**
 * Add event to favorites
 */
export const addEventToFavoritesRequest = async (eventId: string, studentId: string): Promise<void> => {
  try {
    console.log('🚀 addEventToFavoritesRequest - Making API call:', { eventId, studentId });

    const response = await getApi().post(
      `/api/events/${eventId}/favorite`,
      {
        studentId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('✅ addEventToFavoritesRequest - Success:', response.status);
    console.log('📝 addEventToFavoritesRequest - Response:', response.data);
  } catch (error: any) {
    console.error('❌ addEventToFavoritesRequest - Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request was made but no response received');
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

/**
 * Remove event from favorites
 */
export const removeEventFromFavoritesRequest = async (eventId: string, studentId: string): Promise<void> => {
  try {
    console.log('🚀 removeEventFromFavoritesRequest - Making API call:', { eventId, studentId });

    const response = await getApi().delete(`/api/events/${eventId}/favorite`, {
      data: { studentId },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ removeEventFromFavoritesRequest - Success:', response.status);
    console.log('📝 removeEventFromFavoritesRequest - Response:', response.data);
  } catch (error: any) {
    console.error('❌ removeEventFromFavoritesRequest - Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request was made but no response received');
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

/**
 * Get student's favorite events
 */
export const getStudentFavoriteEventsRequest = async (
  studentId: string,
  params?: {
    page?: number;
    pageSize?: number;
  },
): Promise<{ favorites: IEventFavoriteResponse[]; totalCount: number; page: number; pageSize: number }> => {
  try {
    console.log('🚀 getStudentFavoriteEventsRequest - Making API call:', { studentId, params });

    const response: AxiosResponse<{
      favorites: IEventFavoriteResponse[];
      totalCount: number;
      page: number;
      pageSize: number;
    }> = await getApi().get(`/api/events/favorites/student/${studentId}`, { params });

    console.log('✅ getStudentFavoriteEventsRequest - Success:', response.status);
    console.log('📝 getStudentFavoriteEventsRequest - Response data count:', response.data?.favorites?.length || 0);

    return response.data;
  } catch (error: any) {
    console.error('❌ getStudentFavoriteEventsRequest - Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

// Event Categories and Types

/**
 * Get events by category
 */
export const getEventsByCategoryRequest = async (
  category: string,
  params?: {
    page?: number;
    pageSize?: number;
  },
): Promise<IEventsListResponse> => {
  const response: AxiosResponse<IEventsListResponse> = await getApi().get(`/api/events`, {
    params: { ...params, category },
  });
  return response.data;
};

/**
 * Get events by type
 */
export const getEventsByTypeRequest = async (
  type: string,
  params?: {
    page?: number;
    pageSize?: number;
  },
): Promise<IEventsListResponse> => {
  const response: AxiosResponse<IEventsListResponse> = await getApi().get(`/api/events`, {
    params: { ...params, type },
  });
  return response.data;
};

/**
 * Check if student is registered for an event
 */
export const checkEventRegistrationStatusRequest = async (eventId: string, studentId: string): Promise<{ isRegistered: boolean }> => {
  const response: AxiosResponse<{ isRegistered: boolean }> = await getApi().get(`/api/events/${eventId}/registration-status/${studentId}`);
  return response.data;
};

/**
 * Check if student has event in favorites
 */
export const checkEventFavoriteStatusRequest = async (eventId: string, studentId: string): Promise<{ isFavorite: boolean }> => {
  const response: AxiosResponse<{ isFavorite: boolean }> = await getApi().get(`/api/events/${eventId}/favorite-status/${studentId}`);
  return response.data;
};

/**
 * Get event attendees
 */
export const getEventAttendeesRequest = async (eventId: string): Promise<any[]> => {
  try {
    console.log('🚀 getEventAttendeesRequest - Making API call:', { eventId });

    const response: AxiosResponse<any[]> = await getApi().get(`/api/events/${eventId}/attendees`);

    console.log('✅ getEventAttendeesRequest - Success:', response.status);
    console.log('📝 getEventAttendeesRequest - Response data count:', response.data?.length || 0);

    return response.data;
  } catch (error: any) {
    console.error('❌ getEventAttendeesRequest - Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

/**
 * Get all published events with filtering (no pagination)
 */
export const getAllEventsRequest = async (params?: {
  featured?: boolean;
  category?: string;
  type?: string;
  search?: string;
  location?: string;
}): Promise<IEventSummaryResponse[]> => {
  try {
    console.log('🚀 getAllEventsRequest - Making API call:', { params });

    const response: AxiosResponse<IEventSummaryResponse[]> = await getApi().get('/api/events/all', { params });

    console.log('✅ getAllEventsRequest - Success:', response.status);
    console.log('📝 getAllEventsRequest - Response data count:', response.data?.length || 0);

    return response.data;
  } catch (error: any) {
    console.error('❌ getAllEventsRequest - Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export interface EventRegistrationFormValues {
  eventId: string;
  additionalInfo?: string;
}
