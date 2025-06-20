import { createAction } from '@reduxjs/toolkit';
import {
  SET_EVENTS,
  SET_SELECTED_EVENT,
  SET_FEATURED_EVENTS,
  SET_UPCOMING_EVENTS,
  SET_EVENTS_LOADING,
  SET_EVENTS_ERROR,
  CLEAR_EVENTS_ERROR,
  SET_EVENT_PAGINATION,
  SET_EVENT_FILTERS,
  CLEAR_EVENT_FILTERS,
  SET_USER_REGISTRATIONS,
  ADD_USER_REGISTRATION,
  REMOVE_USER_REGISTRATION,
  SET_REGISTRATION_LOADING,
  SET_REGISTRATION_ERROR,
  CLEAR_REGISTRATION_ERROR,
  SET_USER_FAVORITES,
  ADD_USER_FAVORITE,
  REMOVE_USER_FAVORITE,
  SET_FAVORITES_LOADING,
  SET_FAVORITES_ERROR,
  CLEAR_FAVORITES_ERROR,
} from '../../constants';
import IEventResponse, { IPaginationInfo, IEventSummaryResponse, IEventFilters, IEventRegistrationResponse, IEventFavoriteResponse } from '@app/types/event/IEventResponse';

// Event list actions
export const setEventsAction = createAction<{
  events: IEventResponse[];
  pagination: IPaginationInfo;
}>(SET_EVENTS);

export const setSelectedEventAction = createAction<IEventResponse | null>(SET_SELECTED_EVENT);

export const setFeaturedEventsAction = createAction<IEventSummaryResponse[]>(SET_FEATURED_EVENTS);

export const setUpcomingEventsAction = createAction<IEventSummaryResponse[]>(SET_UPCOMING_EVENTS);

// Loading and error actions
export const setEventsLoadingAction = createAction<boolean>(SET_EVENTS_LOADING);

export const setEventsErrorAction = createAction<string>(SET_EVENTS_ERROR);

export const clearEventsErrorAction = createAction(CLEAR_EVENTS_ERROR);

// Pagination and filtering actions
export const setEventPaginationAction = createAction<IPaginationInfo>(SET_EVENT_PAGINATION);

export const setEventFiltersAction = createAction<Partial<IEventFilters>>(SET_EVENT_FILTERS);

export const clearEventFiltersAction = createAction(CLEAR_EVENT_FILTERS);

// Registration actions
export const setUserRegistrationsAction = createAction<{
  registrations: IEventRegistrationResponse[];
  pagination: IPaginationInfo;
}>(SET_USER_REGISTRATIONS);

export const addUserRegistrationAction = createAction<IEventRegistrationResponse>(ADD_USER_REGISTRATION);

export const removeUserRegistrationAction = createAction<string>(REMOVE_USER_REGISTRATION);

export const setRegistrationLoadingAction = createAction<boolean>(SET_REGISTRATION_LOADING);

export const setRegistrationErrorAction = createAction<string>(SET_REGISTRATION_ERROR);

export const clearRegistrationErrorAction = createAction(CLEAR_REGISTRATION_ERROR);

// Favorites actions
export const setUserFavoritesAction = createAction<{
  favorites: IEventFavoriteResponse[];
  pagination: IPaginationInfo;
}>(SET_USER_FAVORITES);

export const addUserFavoriteAction = createAction<IEventFavoriteResponse>(ADD_USER_FAVORITE);

export const removeUserFavoriteAction = createAction<string>(REMOVE_USER_FAVORITE);

export const setFavoritesLoadingAction = createAction<boolean>(SET_FAVORITES_LOADING);

export const setFavoritesErrorAction = createAction<string>(SET_FAVORITES_ERROR);

export const clearFavoritesErrorAction = createAction(CLEAR_FAVORITES_ERROR);
