export default interface IAssociationResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  coverImage: string;
  category: string;
  foundedYear: number;
  isVerified: boolean;
  events: number;
  upcomingEventsCount?: number;
  followers?: number;
  location?: string;
  website?: string;
  tags: string[];
  email: string;
  phone?: string;
  address?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedIn?: string;
  eventIds: string[];
  announcementIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IAssociationSummaryResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  coverImage: string;
  category: string;
  foundedYear: number;
  isVerified: boolean;
  events: number;
  upcomingEventsCount?: number;
  followers?: number;
  location?: string;
  website?: string;
  tags: string[];
  email: string;
  eventIds: string[];
  announcementIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IAssociationsListResponse {
  associations: IAssociationSummaryResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
}
