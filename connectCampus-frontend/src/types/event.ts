// Event types aligned with backend entities

export enum EventStatus {
  Draft = 'Draft',
  Published = 'Published',
  Canceled = 'Canceled',
  Postponed = 'Postponed',
  Completed = 'Completed',
}

export enum EventType {
  Party = 'Party',
  Conference = 'Conference',
  Training = 'Training',
  Workshop = 'Workshop',
  Seminar = 'Seminar',
  Networking = 'Networking',
  Fundraising = 'Fundraising',
  Competition = 'Competition',
  Cultural = 'Cultural',
  Sports = 'Sports',
  Other = 'Other',
}

export interface IEvent {
  id: string;
  associationId: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
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
  registrationUrl: string;
  price?: number;
  isFree: boolean;
  paymentMethod: string;
  contactEmail: string;
  status: EventStatus;
  attendeesCount: number;
  maxAttendees?: number;
  associationName: string;
  associationLogo: string;
  announcements: string[];
  type: EventType;
  createdAt: string;
  updatedAt: string;
}

export interface IEventUpdate {
  title: string;
  description: string;
  coverImageUrl: string;
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
  registrationUrl: string;
  price?: number;
  isFree: boolean;
  paymentMethod: string;
  contactEmail: string;
  status: EventStatus;
  type: EventType;
  maxAttendees?: number;
}

export interface IEventCreate {
  title: string;
  description: string;
  coverImageUrl: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location: string;
  category: string;
  tags: string[];
  capacity: number;
  isPublic: boolean;
  registrationRequired: boolean;
  registrationDeadline?: string;
  registrationUrl: string;
  price?: number;
  isFree: boolean;
  paymentMethod: string;
  contactEmail: string;
  type: EventType;
  maxAttendees?: number;
}

// Summary interface for event lists and cards
export interface EventSummary {
  id: string;
  associationId: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  tags: string[];
  capacity: number;
  isFeatured: boolean;
  registrationRequired: boolean;
  registrationUrl: string;
  price?: number;
  isFree: boolean;
  status: EventStatus;
  attendeesCount: number;
  maxAttendees?: number;
  associationName: string;
  associationLogo: string;
  type: EventType;
}
