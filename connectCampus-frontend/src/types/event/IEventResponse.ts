export default interface IEventResponse {
  id: string;
  associationId: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location: string;
  category: string;
  tags: string[];
  capacity: number;
  isPublic: boolean;
  isFeatured: boolean;
  registrationRequired: boolean;
  registrationDeadline?: string;
  registrationUrl?: string;
  price?: number;
  isFree: boolean;
  paymentMethod?: string;
  contactEmail: string;
  status: number | string;
  attendeesCount: number;
  maxAttendees?: number;
  associationName: string;
  associationLogo?: string;
  type: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface IEventSummaryResponse {
  id: string;
  associationId: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  registrationRequired: boolean;
  price?: number;
  isFree: boolean;
  status: number | string;
  attendeesCount: number;
  maxAttendees?: number;
  associationName: string;
  associationLogo?: string;
  type: number | string;
}

export interface IEventsListResponse {
  events: IEventSummaryResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface IEventRegistrationResponse {
  id: string;
  eventId: string;
  studentId: string;
  registrationDate: string;
  event: IEventSummaryResponse;
}

export interface IEventFavoriteResponse {
  id: string;
  eventId: string;
  studentId: string;
  favoritedAt: string;
  event: IEventSummaryResponse;
}

// Pagination and filters
export interface IPaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface IEventFilters {
  category?: string;
  type?: string;
  featured?: boolean;
  upcomingOnly?: boolean;
  location?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  isFree?: boolean;
}

// Types are already exported as named exports above
