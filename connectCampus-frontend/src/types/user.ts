// User types aligned with backend entities

export enum UserRole {
  Student = 'Student',
  Association = 'Association',
}

export enum Theme {
  System = 'System',
  Light = 'Light',
  Dark = 'Dark',
}

export interface IUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;

  // Two-factor authentication
  isTwoFactorEnabled: boolean;

  // Notification preferences
  eventRemindersEnabled: boolean;
  messageNotificationsEnabled: boolean;
  associationUpdatesEnabled: boolean;
  marketingEmailsEnabled: boolean;

  // Theme preference
  preferredTheme: Theme;
}

export interface IUserUpdate {
  email?: string;
  eventRemindersEnabled?: boolean;
  messageNotificationsEnabled?: boolean;
  associationUpdatesEnabled?: boolean;
  marketingEmailsEnabled?: boolean;
  preferredTheme?: Theme;
}

// User and Student interfaces aligned with backend entities
export interface User {
  id: string;
  email: string;
  role: UserRole;
  isEmailConfirmed: boolean;
  isTwoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  university: string;
  faculty: string;
  specialization: string;
  studyYear: number;
  educationLevel: EducationLevel;
  bio?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  facebookUrl?: string;
  interests: string[];
  avatarUrl?: string;
  followingCount: number;
  followersCount: number;
  eventsAttendedCount: number;
  favoriteEventsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  university: string;
  faculty: string;
  specialization: string;
  studyYear: number;
  educationLevel: EducationLevel;
  bio?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  facebookUrl?: string;
  interests: string[];
  avatarUrl?: string;
  followingCount: number;
  followersCount: number;
  eventsAttendedCount: number;
  favoriteEventsCount: number;
  isFollowing?: boolean;
  mutualFollowers?: number;
}

export enum EducationLevel {
  Bachelor = 'Bachelor',
  Master = 'Master',
  PhD = 'PhD',
}

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
}
