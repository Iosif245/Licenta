import { RootState } from '../index';
import { createSelector } from '@reduxjs/toolkit';
import IEventState from '@app/types/event/IEventState';

// Base selector
const eventsStateSelector = (state: RootState): IEventState => state.events;

// Event data selectors
export const eventsListSelector = createSelector([eventsStateSelector], eventsState => eventsState.eventsList.events);

export const eventsListPaginationSelector = createSelector([eventsStateSelector], eventsState => eventsState.eventsList.pagination);

export const selectedEventSelector = createSelector([eventsStateSelector], eventsState => eventsState.currentEvent);

export const featuredEventsSelector = createSelector([eventsStateSelector], eventsState => eventsState.featuredEvents);

export const upcomingEventsSelector = createSelector([eventsStateSelector], eventsState => eventsState.upcomingEvents);

// User-specific selectors
export const userRegistrationsSelector = createSelector([eventsStateSelector], eventsState => eventsState.userRegistrations.registrations);

export const userRegistrationsPaginationSelector = createSelector([eventsStateSelector], eventsState => eventsState.userRegistrations.pagination);

export const userFavoritesSelector = createSelector([eventsStateSelector], eventsState => eventsState.userFavorites.favorites);

export const userFavoritesPaginationSelector = createSelector([eventsStateSelector], eventsState => eventsState.userFavorites.pagination);

// Filter selectors
export const eventFiltersSelector = createSelector([eventsStateSelector], eventsState => eventsState.filters);

// Loading state selectors
export const eventsLoadingSelector = createSelector([eventsStateSelector], eventsState => eventsState.loading);

export const registrationLoadingSelector = createSelector([eventsStateSelector], eventsState => eventsState.registrationLoading);

export const favoritesLoadingSelector = createSelector([eventsStateSelector], eventsState => eventsState.favoritesLoading);

// Error state selectors
export const eventsErrorSelector = createSelector([eventsStateSelector], eventsState => eventsState.error);

export const registrationErrorSelector = createSelector([eventsStateSelector], eventsState => eventsState.registrationError);

export const favoritesErrorSelector = createSelector([eventsStateSelector], eventsState => eventsState.favoritesError);

// Utility selectors
export const isEventRegisteredSelector = createSelector([userRegistrationsSelector, (_: RootState, eventId: string) => eventId], (registrations, eventId) =>
  registrations.some(reg => reg.eventId === eventId),
);

export const isEventFavoritedSelector = createSelector([userFavoritesSelector, (_: RootState, eventId: string) => eventId], (favorites, eventId) =>
  favorites.some(fav => fav.eventId === eventId),
);

export const getEventByIdSelector = createSelector([eventsListSelector, (_: RootState, eventId: string) => eventId], (events, eventId) =>
  events.find(event => event.id === eventId),
);

// Combined state selectors
export const eventsPageStateSelector = createSelector(
  [eventsListSelector, eventsListPaginationSelector, eventsLoadingSelector, eventsErrorSelector, eventFiltersSelector],
  (events, pagination, loading, error, filters) => ({
    events,
    pagination,
    loading,
    error,
    filters,
  }),
);

export const userEventsStateSelector = createSelector(
  [
    userRegistrationsSelector,
    userRegistrationsPaginationSelector,
    userFavoritesSelector,
    userFavoritesPaginationSelector,
    registrationLoadingSelector,
    favoritesLoadingSelector,
    registrationErrorSelector,
    favoritesErrorSelector,
  ],
  (registrations, registrationsPagination, favorites, favoritesPagination, registrationLoading, favoritesLoading, registrationError, favoritesError) => ({
    registrations: {
      data: registrations,
      pagination: registrationsPagination,
      loading: registrationLoading,
      error: registrationError,
    },
    favorites: {
      data: favorites,
      pagination: favoritesPagination,
      loading: favoritesLoading,
      error: favoritesError,
    },
  }),
);

export const eventDetailStateSelector = createSelector(
  [selectedEventSelector, eventsLoadingSelector, eventsErrorSelector, registrationLoadingSelector, favoritesLoadingSelector, registrationErrorSelector, favoritesErrorSelector],
  (event, loading, error, registrationLoading, favoritesLoading, registrationError, favoritesError) => ({
    event,
    loading,
    error,
    registrationLoading,
    favoritesLoading,
    registrationError,
    favoritesError,
  }),
);

export const eventsByAssociationSelector = (state: RootState) => state.events.eventsList;

// Status check selectors
export const currentEventRegistrationStatusSelector = (state: RootState) => state.events.currentEventRegistrationStatus;
export const currentEventFavoriteStatusSelector = (state: RootState) => state.events.currentEventFavoriteStatus;
export const statusLoadingSelector = (state: RootState) => state.events.statusLoading;
