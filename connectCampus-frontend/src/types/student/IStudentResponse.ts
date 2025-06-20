export default interface IStudentResponse {
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
  bio?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  facebookUrl?: string;
  interests: string[];
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStudentSummaryResponse {
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
}

export interface IStudentsListResponse {
  students: IStudentSummaryResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
}
