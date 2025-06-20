export default interface IFollowResponse {
  id: number;
  studentId: string;
  associationId: string;
  createdAt: string;
}

export interface IFollowerResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
  university: string;
  faculty: string;
  specialization: string;
  studyYear: number;
  educationLevel: string;
  createdAt?: string;
}

export interface IFollowedAssociationResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  category: string;
  foundedYear: number;
  isVerified: boolean;
  events: number;
  upcomingEventsCount?: number;
  followers?: number;
  location?: string;
  website?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IFollowStatsResponse {
  followersCount: number;
  followingCount: number;
}
