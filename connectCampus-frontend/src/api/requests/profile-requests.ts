import { AxiosResponse } from 'axios';
import { getApi } from '../index';
import IUserProfileResponse from '@app/types/profile/IProfileResponse';

// API Request Functions

/**
 * Get current user profile (complete profile with student/association data)
 */
export const fetchProfileRequest = async (): Promise<IUserProfileResponse> => {
  const response: AxiosResponse<IUserProfileResponse> = await getApi().get('/api/profiles/me');
  return response.data;
};

/**
 * Update student profile
 */
export const updateStudentProfileRequest = async (id: string, data: any): Promise<void> => {
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
