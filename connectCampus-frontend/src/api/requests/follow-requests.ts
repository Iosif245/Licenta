import { AxiosResponse } from 'axios';
import { getApi } from '../index';
import IFollowResponse, { IFollowerResponse, IFollowedAssociationResponse, IFollowStatsResponse } from '@app/types/follow/IFollowResponse';

export const followAssociationRequest = async (studentId: string, associationId: string): Promise<Partial<IFollowResponse>> => {
  const response: AxiosResponse<IFollowResponse> = await getApi().post('/api/follows', {
    studentId,
    associationId,
  });
  return response.data;
};

/**
 * Unfollow an association
 */
export const unfollowAssociationRequest = async (studentId: string, associationId: string): Promise<void> => {
  await getApi().delete(`/api/follows/associations/${associationId}/students/${studentId}`);
};

/**
 * Check if student follows an association
 */
export const checkFollowStatusRequest = async (studentId: string, associationId: string): Promise<boolean> => {
  try {
    const response = await getApi().get(`/api/follows/associations/${associationId}/students/${studentId}`);
    return response.status === 204; // 204 means following, 404 means not following
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false; // Not following
    }
    throw error;
  }
};

/**
 * Get followers of an association (returns FollowDto with student IDs)
 */
export const getAssociationFollowersRequest = async (associationId: string): Promise<IFollowerResponse[]> => {
  try {
    // First get the follow records with student IDs and createdAt
    const followResponse = await getApi().get(`/api/follows/associations/${associationId}`);
    const follows = followResponse.data; // Array of FollowDto objects

    // Now fetch full student details for each student ID
    if (!follows || follows.length === 0) {
      return [];
    }

    const { getStudentByIdRequest } = await import('@app/api/requests/student-requests');

    const studentPromises = follows.map(async (follow: any) => {
      try {
        const student = await getStudentByIdRequest(follow.studentId);
        // Convert to IFollowerResponse format and preserve createdAt from follow
        return {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          profilePictureUrl: student.profilePictureUrl,
          university: student.university,
          faculty: student.faculty,
          specialization: student.specialization,
          studyYear: student.studyYear,
          educationLevel:
            typeof student.educationLevel === 'object' && student.educationLevel && 'name' in student.educationLevel
              ? (student.educationLevel as any).name
              : typeof student.educationLevel === 'string'
                ? student.educationLevel
                : '',
          createdAt: follow.createdAt, // Preserve the follow creation date
        };
      } catch (error) {
        console.error(`Failed to fetch student ${follow.studentId}:`, error);
        return null;
      }
    });

    const results = await Promise.all(studentPromises);
    return results.filter(student => student !== null) as IFollowerResponse[];
  } catch (error: any) {
    // Return empty array instead of throwing to prevent UI crashes
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

/**
 * Get associations followed by a student (returns full AssociationSummaryDto objects - already has full data)
 */
export const getStudentFollowsRequest = async (studentId: string): Promise<IFollowedAssociationResponse[]> => {
  const response: AxiosResponse<IFollowedAssociationResponse[]> = await getApi().get(`/api/follows/students/${studentId}`);
  return response.data;
};

/**
 * Get associations followed by a student with pagination (already returns full data)
 */
export const getStudentFollowsPagedRequest = async (
  studentId: string,
  params?: {
    page?: number;
    pageSize?: number;
  },
): Promise<{
  items: IFollowedAssociationResponse[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}> => {
  const response = await getApi().get(`/api/follows/students/${studentId}/paged`, { params });
  return response.data;
};

/**
 * Get follow statistics for a student
 */
export const getStudentFollowStatsRequest = async (studentId: string): Promise<Partial<IFollowStatsResponse>> => {
  const response: AxiosResponse<IFollowStatsResponse> = await getApi().get(`/api/students/${studentId}/follow-stats`);
  return response.data;
};

export const removeFollowerRequest = async (associationId: string, studentId: string): Promise<void> => {
  await getApi().delete(`/api/associations/${associationId}/followers/${studentId}`);
};

export const getFollowNotificationsRequest = async (studentId: string): Promise<any[]> => {
  const response: AxiosResponse<any[]> = await getApi().get(`/api/students/${studentId}/follow-notifications`);
  return response.data;
};

/**
 * Mark follow notification as read
 */
export const markFollowNotificationReadRequest = async (notificationId: string): Promise<void> => {
  await getApi().patch(`/api/notifications/${notificationId}/read`);
};
