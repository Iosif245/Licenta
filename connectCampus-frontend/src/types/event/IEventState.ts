import IEventResponse, { IEventSummaryResponse, IEventRegistrationResponse, IEventFavoriteResponse, IPaginationInfo, IEventFilters } from './IEventResponse';

interface IEventState {
  // Current selected event
  currentEvent: IEventResponse | null;

  // Events list with pagination
  eventsList: {
    events: IEventSummaryResponse[];
    pagination: IPaginationInfo;
  };

  // Featured events
  featuredEvents: IEventSummaryResponse[];

  // Upcoming events
  upcomingEvents: IEventSummaryResponse[];

  // User's event registrations
  userRegistrations: {
    registrations: IEventRegistrationResponse[];
    pagination: IPaginationInfo;
  };

  // User's favorite events
  userFavorites: {
    favorites: IEventFavoriteResponse[];
    pagination: IPaginationInfo;
  };

  // Active filters
  filters: IEventFilters;

  // Loading states
  loading: boolean;
  registrationLoading: boolean;
  favoritesLoading: boolean;

  // Error states
  error: string | null;
  registrationError: string | null;
  favoritesError: string | null;

  // Status checks for current event
  currentEventRegistrationStatus: boolean | null;
  currentEventFavoriteStatus: boolean | null;
  statusLoading: boolean;
}

export default IEventState;
