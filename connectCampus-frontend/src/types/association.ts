// Association types aligned with backend entities

export interface IAssociation {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  coverImage: string;
  category: string;
  foundedYear: number;
  isVerified: boolean;
  isFeatured: boolean;
  members: number;
  events: number;
  upcomingEventsCount?: number;
  rating?: number;
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
  leadershipIds: string[];
  upcomingEventIds: string[];
  pastEventIds: string[];
  announcementIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IAssociationUpdate {
  name: string;
  slug: string;
  description: string;
  category: string;
  foundedYear: number;
  email: string;
  location?: string;
  website?: string;
  phone?: string;
  address?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedIn?: string;
  tags?: string[];
  logo?: File | null;
  coverImage?: File | null;
}

export interface IAssociationRegistration {
  name: string;
  email: string;
  password: string;
  description: string;
  category: string;
  foundedYear: number;
  website?: string;
  logo?: File | null;
  coverImage?: File | null;
  location?: string;
  phone?: string;
  address?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedIn?: string;
}

export interface AssociationSummary {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo: string;
  coverImage: string;
  category: string;
  foundedYear: number;
  isVerified: boolean;
  isFeatured: boolean;
  members: number;
  events: number;
  upcomingEventsCount?: number;
  rating?: number;
  location?: string;
  tags: string[];
  createdAt: string;
}
