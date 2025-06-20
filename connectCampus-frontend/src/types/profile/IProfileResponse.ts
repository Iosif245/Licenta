export default interface IUserProfileResponse {
  userId: string;
  email: string;
  role: string;
  studentProfile?: IStudentProfile;
  associationProfile?: IAssociationProfile;
}

export interface IStudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  university: string;
  faculty: string;
  specialization: string;
  studyYear: number;
  educationLevel: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  facebookUrl?: string;
  interests: string[];
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAssociationProfile {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  coverImage?: string;
  category: string;
  foundedYear: number;
  isVerified: boolean;
  isFeatured: boolean;
  events: number;
  upcomingEventsCount: number;
  followers: number;
  location: string;
  website?: string;
  tags: string[];
  phone?: string;
  address?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedIn?: string;
  createdAt: string;
  updatedAt: string;
}
