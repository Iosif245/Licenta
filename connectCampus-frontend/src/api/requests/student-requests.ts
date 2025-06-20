import { AxiosResponse } from 'axios';
import { getApi } from '../index';
import IStudentResponse, { IStudentsListResponse } from '@app/types/student/IStudentResponse';

// API Request Functions

/**
 * Get student by ID
 */
export const getStudentByIdRequest = async (id: string): Promise<IStudentResponse> => {
  const response: AxiosResponse<any> = await getApi().get(`/api/students/${id}`);
  const data = response.data;

  // Map backend avatarUrl to frontend profilePictureUrl
  return {
    ...data,
    profilePictureUrl: data.avatarUrl,
  };
};

/**
 * Get list of students with pagination and filtering
 */
export const getStudentsRequest = async (params?: {
  page?: number;
  pageSize?: number;
  university?: string;
  faculty?: string;
  educationLevel?: string;
  search?: string;
}): Promise<Partial<IStudentsListResponse>> => {
  const response: AxiosResponse<IStudentsListResponse> = await getApi().get('/api/students', { params });
  return response.data;
};

/**
 * Create a new student profile (internal use - registration handled by auth)
 */
export const createStudentRequest = async (data: any): Promise<{ id: string }> => {
  const formData = new FormData();

  // Append text fields
  formData.append('firstName', data.firstName);
  formData.append('lastName', data.lastName);
  formData.append('email', data.email);
  formData.append('university', data.university);
  formData.append('faculty', data.faculty);
  formData.append('specialization', data.specialization);
  formData.append('studyYear', data.studyYear.toString());
  formData.append('educationLevel', data.educationLevel);

  if (data.bio) formData.append('bio', data.bio);
  if (data.linkedInUrl) formData.append('linkedInUrl', data.linkedInUrl);
  if (data.gitHubUrl) formData.append('gitHubUrl', data.gitHubUrl);
  if (data.facebookUrl) formData.append('facebookUrl', data.facebookUrl);

  // Append interests as JSON
  if (data.interests && data.interests.length > 0) {
    formData.append('interests', JSON.stringify(data.interests));
  }

  // Append avatar file if provided
  if (data.avatar && data.avatar instanceof File) {
    formData.append('avatar', data.avatar);
  }

  const response: AxiosResponse<{ id: string }> = await getApi().post('/api/students', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Update student profile
 */
export const updateStudentRequest = async (id: string, data: any): Promise<void> => {
  const formData = new FormData();

  // Append text fields
  if (data.firstName) formData.append('firstName', data.firstName);
  if (data.lastName) formData.append('lastName', data.lastName);
  if (data.university) formData.append('university', data.university);
  if (data.faculty) formData.append('faculty', data.faculty);
  if (data.specialization) formData.append('specialization', data.specialization);
  if (data.studyYear) formData.append('studyYear', data.studyYear.toString());
  if (data.educationLevel) formData.append('educationLevel', data.educationLevel);
  if (data.bio !== undefined) formData.append('bio', data.bio || '');
  if (data.linkedInUrl !== undefined) formData.append('linkedInUrl', data.linkedInUrl || '');
  if (data.gitHubUrl !== undefined) formData.append('gitHubUrl', data.gitHubUrl || '');
  if (data.facebookUrl !== undefined) formData.append('facebookUrl', data.facebookUrl || '');

  // Append interests as JSON
  if (data.interests) {
    formData.append('interests', JSON.stringify(data.interests));
  }

  // Append avatar file if provided
  if (data.avatar && data.avatar instanceof File) {
    formData.append('avatar', data.avatar);
  }

  await getApi().put(`/api/students/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Update student avatar
 */
export const updateStudentAvatarRequest = async (id: string, avatar: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData();
  formData.append('avatar', avatar);

  const response: AxiosResponse<{ avatarUrl: string }> = await getApi().put(`/api/students/${id}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Update student interests
 */
export const updateStudentInterestsRequest = async (id: string, interests: string[]): Promise<void> => {
  await getApi().put(`/api/students/${id}/interests`, { Interests: interests });
};

/**
 * Delete student profile
 */
export const deleteStudentRequest = async (id: string): Promise<void> => {
  await getApi().delete(`/api/students/${id}`);
};

/**
 * Search students by query
 */
export const searchStudentsRequest = async (
  query: string,
  filters?: {
    university?: string;
    faculty?: string;
    educationLevel?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<Partial<IStudentsListResponse>> => {
  const params = { search: query, ...filters };
  const response: AxiosResponse<IStudentsListResponse> = await getApi().get('/api/students/search', { params });
  return response.data;
};
