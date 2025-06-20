import { createReducer } from '@reduxjs/toolkit';
import IEventState from '@app/types/event/IEventState';
import {
  // Sync actions
  setEventsAction,
  setSelectedEventAction,
  setFeaturedEventsAction,
  setUpcomingEventsAction,
  setEventsLoadingAction,
  setEventsErrorAction,
  clearEventsErrorAction,
  setEventPaginationAction,
  setEventFiltersAction,
  clearEventFiltersAction,
  setUserRegistrationsAction,
  addUserRegistrationAction,
  removeUserRegistrationAction,
  setRegistrationLoadingAction,
  setRegistrationErrorAction,
  clearRegistrationErrorAction,
  setUserFavoritesAction,
  addUserFavoriteAction,
  removeUserFavoriteAction,
  setFavoritesLoadingAction,
  setFavoritesErrorAction,
  clearFavoritesErrorAction,
} from '../actions/events/events-sync-actions';
import {
  // Async actions
  getEventsActionAsync,
  getEventByIdActionAsync,
  getEventBySlugActionAsync,
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
  getEventsByAssociationActionAsync,
  checkEventRegistrationStatusActionAsync,
  checkEventFavoriteStatusActionAsync,
} from '../actions/events/events-async-actions';

const initialState: IEventState = {
  currentEvent: null,
  eventsList: {
    events: [],
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0,
    },
  },
  featuredEvents: [],
  upcomingEvents: [],
  userRegistrations: {
    registrations: [],
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0,
    },
  },
  userFavorites: {
    favorites: [],
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0,
    },
  },
  filters: {},
  loading: false,
  registrationLoading: false,
  favoritesLoading: false,
  error: null,
  registrationError: null,
  favoritesError: null,
  // Status checks for current event
  currentEventRegistrationStatus: null,
  currentEventFavoriteStatus: null,
  statusLoading: false,
};

const eventsReducer = createReducer(initialState, builder => {
  builder
    // Sync actions
    .addCase(setEventsAction, (state, action) => {
      state.eventsList = {
        events: action.payload.events,
        pagination: action.payload.pagination,
      };
    })
    .addCase(setSelectedEventAction, (state, action) => {
      state.currentEvent = action.payload;
    })
    .addCase(setFeaturedEventsAction, (state, action) => {
      state.featuredEvents = action.payload;
    })
    .addCase(setUpcomingEventsAction, (state, action) => {
      state.upcomingEvents = action.payload;
    })
    .addCase(setEventsLoadingAction, (state, action) => {
      state.loading = action.payload;
    })
    .addCase(setEventsErrorAction, (state, action) => {
      state.error = action.payload;
    })
    .addCase(clearEventsErrorAction, state => {
      state.error = null;
    })
    .addCase(setEventPaginationAction, (state, action) => {
      state.eventsList.pagination = action.payload;
    })
    .addCase(setEventFiltersAction, (state, action) => {
      state.filters = {
        ...(typeof state.filters === 'object' && state.filters !== null ? state.filters : {}),
        ...(typeof action.payload === 'object' && action.payload !== null ? action.payload : {}),
      };
    })
    .addCase(clearEventFiltersAction, state => {
      state.filters = {};
    })

    // Registration sync actions
    .addCase(setUserRegistrationsAction, (state, action) => {
      state.userRegistrations = {
        registrations: action.payload.registrations,
        pagination: action.payload.pagination,
      };
    })
    .addCase(addUserRegistrationAction, (state, action) => {
      state.userRegistrations.registrations.push(action.payload);
      state.userRegistrations.pagination.totalCount += 1;
    })
    .addCase(removeUserRegistrationAction, (state, action) => {
      state.userRegistrations.registrations = state.userRegistrations.registrations.filter(reg => reg.eventId !== action.payload);
      state.userRegistrations.pagination.totalCount -= 1;
    })
    .addCase(setRegistrationLoadingAction, (state, action) => {
      state.registrationLoading = action.payload;
    })
    .addCase(setRegistrationErrorAction, (state, action) => {
      state.registrationError = action.payload;
    })
    .addCase(clearRegistrationErrorAction, state => {
      state.registrationError = null;
    })

    // Favorites sync actions
    .addCase(setUserFavoritesAction, (state, action) => {
      state.userFavorites = {
        favorites: action.payload.favorites,
        pagination: action.payload.pagination,
      };
    })
    .addCase(addUserFavoriteAction, (state, action) => {
      state.userFavorites.favorites.push(action.payload);
      state.userFavorites.pagination.totalCount += 1;
    })
    .addCase(removeUserFavoriteAction, (state, action) => {
      state.userFavorites.favorites = state.userFavorites.favorites.filter(fav => fav.eventId !== action.payload);
      state.userFavorites.pagination.totalCount -= 1;
    })
    .addCase(setFavoritesLoadingAction, (state, action) => {
      state.favoritesLoading = action.payload;
    })
    .addCase(setFavoritesErrorAction, (state, action) => {
      state.favoritesError = action.payload;
    })
    .addCase(clearFavoritesErrorAction, state => {
      state.favoritesError = null;
    })

    // Async actions - Events CRUD
    .addCase(getEventsActionAsync.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getEventsActionAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.eventsList = {
        events: action.payload.events,
        pagination: {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalCount: action.payload.totalCount,
        },
      };
    })
    .addCase(getEventsActionAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    .addCase(getEventByIdActionAsync.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getEventByIdActionAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.currentEvent = action.payload;
    })
    .addCase(getEventByIdActionAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    .addCase(getEventBySlugActionAsync.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getEventBySlugActionAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.currentEvent = action.payload;
    })
    .addCase(getEventBySlugActionAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    .addCase(getFeaturedEventsActionAsync.pending, state => {
      state.loading = true;
    })
    .addCase(getFeaturedEventsActionAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.featuredEvents = action.payload;
    })
    .addCase(getFeaturedEventsActionAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    .addCase(getUpcomingEventsActionAsync.pending, state => {
      state.loading = true;
    })
    .addCase(getUpcomingEventsActionAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.upcomingEvents = action.payload;
    })
    .addCase(getUpcomingEventsActionAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    .addCase(createEventActionAsync.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createEventActionAsync.fulfilled, (state) => {
      state.loading = false;
      // Note: action.payload is { id: string }, not a full event object
      // We'll need to refetch the events list to get the complete event data
      state.eventsList.pagination.totalCount += 1;
    })
    .addCase(createEventActionAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    .addCase(updateEventActionAsync.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateEventActionAsync.fulfilled, (state, action) => {
      state.loading = false;
      // Update event in list if it exists
      const eventIndex = state.eventsList.events.findIndex(event => event.id === action.payload);
      if (eventIndex !== -1) {
        // Refetch the updated event or mark for refresh
        state.currentEvent = null; // Force refetch
      }
    })
    .addCase(updateEventActionAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    .addCase(deleteEventActionAsync.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteEventActionAsync.fulfilled, (state, action) => {
      state.loading = false;
      // Remove event from list
      state.eventsList.events = state.eventsList.events.filter(event => event.id !== action.payload);
      state.eventsList.pagination.totalCount -= 1;

      // Clear current event if it was deleted
      if (state.currentEvent?.id === action.payload) {
        state.currentEvent = null;
      }
    })
    .addCase(deleteEventActionAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // Async actions - Registration
    .addCase(registerForEventActionAsync.pending, state => {
      state.registrationLoading = true;
      state.registrationError = null;
    })
    .addCase(registerForEventActionAsync.fulfilled, (state, action) => {
      state.registrationLoading = false;
      // Update attendees count if current event matches
      if (state.currentEvent?.id === action.payload.eventId) {
        state.currentEvent.attendeesCount += 1;
      }
      // Update event in list
      const eventIndex = state.eventsList.events.findIndex(event => event.id === action.payload.eventId);
      if (eventIndex !== -1) {
        state.eventsList.events[eventIndex].attendeesCount += 1;
      }
    })
    .addCase(registerForEventActionAsync.rejected, (state, action) => {
      state.registrationLoading = false;
      state.registrationError = action.payload as string;
    })

    .addCase(unregisterFromEventActionAsync.pending, state => {
      state.registrationLoading = true;
      state.registrationError = null;
    })
    .addCase(unregisterFromEventActionAsync.fulfilled, (state, action) => {
      state.registrationLoading = false;
      // Update attendees count if current event matches
      if (state.currentEvent?.id === action.payload.eventId) {
        state.currentEvent.attendeesCount -= 1;
      }
      // Update event in list
      const eventIndex = state.eventsList.events.findIndex(event => event.id === action.payload.eventId);
      if (eventIndex !== -1) {
        state.eventsList.events[eventIndex].attendeesCount -= 1;
      }
      // Note: We no longer maintain userRegistrations array since we use status checks
      // The status will be updated separately via checkEventRegistrationStatusActionAsync
    })
    .addCase(unregisterFromEventActionAsync.rejected, (state, action) => {
      state.registrationLoading = false;
      state.registrationError = action.payload as string;
    })

    .addCase(getUserRegistrationsActionAsync.pending, state => {
      state.registrationLoading = true;
      state.registrationError = null;
    })
    .addCase(getUserRegistrationsActionAsync.fulfilled, (state, action) => {
      state.registrationLoading = false;
      state.userRegistrations = {
        registrations: action.payload.registrations,
        pagination: {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalCount: action.payload.totalCount,
        },
      };
    })
    .addCase(getUserRegistrationsActionAsync.rejected, (state, action) => {
      state.registrationLoading = false;
      state.registrationError = action.payload as string;
    })

    // Async actions - Favorites
    .addCase(addToFavoritesActionAsync.pending, state => {
      state.favoritesLoading = true;
      state.favoritesError = null;
    })
    .addCase(addToFavoritesActionAsync.fulfilled, state => {
      state.favoritesLoading = false;
    })
    .addCase(addToFavoritesActionAsync.rejected, (state, action) => {
      state.favoritesLoading = false;
      state.favoritesError = action.payload as string;
    })

    .addCase(removeFromFavoritesActionAsync.pending, state => {
      state.favoritesLoading = true;
      state.favoritesError = null;
    })
    .addCase(removeFromFavoritesActionAsync.fulfilled, (state) => {
      state.favoritesLoading = false;
      // Note: We no longer maintain userFavorites array since we use status checks
      // The status will be updated separately via checkEventFavoriteStatusActionAsync
    })
    .addCase(removeFromFavoritesActionAsync.rejected, (state, action) => {
      state.favoritesLoading = false;
      state.favoritesError = action.payload as string;
    })

    .addCase(getUserFavoritesActionAsync.pending, state => {
      state.favoritesLoading = true;
      state.favoritesError = null;
    })
    .addCase(getUserFavoritesActionAsync.fulfilled, (state, action) => {
      state.favoritesLoading = false;
      state.userFavorites = {
        favorites: action.payload.favorites,
        pagination: {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalCount: action.payload.totalCount,
        },
      };
    })
    .addCase(getUserFavoritesActionAsync.rejected, (state, action) => {
      state.favoritesLoading = false;
      state.favoritesError = action.payload as string;
    })

    .addCase(getEventsByAssociationActionAsync.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getEventsByAssociationActionAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.eventsList = {
        events: action.payload.events,
        pagination: {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalCount: action.payload.totalCount,
        },
      };
    })
    .addCase(getEventsByAssociationActionAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // Status check actions
    .addCase(checkEventRegistrationStatusActionAsync.pending, state => {
      state.statusLoading = true;
    })
    .addCase(checkEventRegistrationStatusActionAsync.fulfilled, (state, action) => {
      state.statusLoading = false;
      state.currentEventRegistrationStatus = action.payload.isRegistered;
    })
    .addCase(checkEventRegistrationStatusActionAsync.rejected, state => {
      state.statusLoading = false;
      state.currentEventRegistrationStatus = null;
    })

    .addCase(checkEventFavoriteStatusActionAsync.pending, state => {
      state.statusLoading = true;
    })
    .addCase(checkEventFavoriteStatusActionAsync.fulfilled, (state, action) => {
      state.statusLoading = false;
      state.currentEventFavoriteStatus = action.payload.isFavorite;
    })
    .addCase(checkEventFavoriteStatusActionAsync.rejected, state => {
      state.statusLoading = false;
      state.currentEventFavoriteStatus = null;
    });
});

export default eventsReducer;
