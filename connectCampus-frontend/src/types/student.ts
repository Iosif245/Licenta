// Student types aligned with backend entities

export enum EducationLevel {
  Bachelor = 'Bachelor',
  Master = 'Master',
  PhD = 'PhD',
}

export interface IStudent {
  id: string;
  userId: string;
  email: string;
  joinedDate: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  university: string;
  faculty: string;
  specialization: string;
  studyYear: number;
  educationLevel: EducationLevel;
  linkedInUrl?: string;
  gitHubUrl?: string;
  facebookUrl?: string;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IStudentUpdate {
  firstName: string;
  lastName: string;
  bio?: string;
  university: string;
  faculty: string;
  specialization: string;
  studyYear: number;
  educationLevel: EducationLevel;
  linkedInUrl?: string;
  gitHubUrl?: string;
  facebookUrl?: string;
}

export interface IStudentRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  university: string;
  faculty: string;
  specialization: string;
  studyYear: number;
  educationLevel: EducationLevel;
  avatar?: File | null;
}
