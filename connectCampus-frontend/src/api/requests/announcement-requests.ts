import { 
  IAnnouncement, 
  IAnnouncementComment, 
  IAnnouncementLike, 
  IAnnouncementStatistics,
  IAnnouncementsResponse,
  ICreateAnnouncementRequest,
  IUpdateAnnouncementRequest,
  ICreateCommentRequest,
  IUpdateCommentRequest,
  IAnnouncementsFilter
} from '@app/types/announcement';
import { getApi } from '../index';
import { store } from '@app/store';
import { userSelector } from '@app/store/selectors/user-selectors';
import { profileCurrentProfileSelector } from '@app/store/selectors/profile-selectors';

const api = getApi();

// Helper function to get current user info for authorType
const getCurrentUserInfo = () => {
  const state = store.getState();
  const user = userSelector(state);
  const profile = profileCurrentProfileSelector(state);
  
  if (!user || !profile) {
    throw new Error('User must be authenticated to perform this action');
  }

  let authorId: string;
  let authorType: string;

  if (user.role === 'Student') {
    if (!profile.studentProfile?.id) {
      throw new Error('Student profile ID is required');
    }
    authorId = profile.studentProfile.id;
    authorType = 'Student';
  } else if (user.role === 'Association') {
    if (!profile.associationProfile?.id) {
      throw new Error('Association profile ID is required');
    }
    authorId = profile.associationProfile.id;
    authorType = 'Association';
  } else {
    throw new Error(`Invalid user role: ${user.role}`);
  }

  return {
    authorId,
    authorType
  };
};

/**
 * Get announcements with pagination and filters - includes interaction data
 */
export const getAnnouncementsRequest = async (params: IAnnouncementsFilter = {}): Promise<IAnnouncementsResponse> => {
  // Convert frontend filter to backend parameters
  const queryParams: any = {
    page: params.page || 1,
    pageSize: params.pageSize || 12,
  };

  if (params.search && params.search.trim()) {
    queryParams.search = params.search.trim();
  }

  if (params.associationId) {
    queryParams.associationId = params.associationId;
  }

  if (params.eventId) {
    queryParams.eventId = params.eventId;
  }

  // Map frontend type filter to backend
  if (params.type && params.type !== 'all') {
    if (params.type === 'events') {
      // Filter for announcements with eventId
      queryParams.hasEvent = true;
    } else if (params.type === 'general') {
      // Filter for announcements without eventId
      queryParams.hasEvent = false;
    }
  }

  // Add user information for like status if user is authenticated
  try {
    const { authorId, authorType } = getCurrentUserInfo();
    queryParams.userId = authorId;
    queryParams.userType = authorType;
  } catch (error) {
    // User not authenticated - continue without user info
  }

  // Use the with-interactions endpoint to get proper association data and interaction counts
  const response = await api.get('/api/announcements/with-interactions', { params: queryParams });
  

  
  // Transform the response to match our frontend interface
  return {
    announcements: response.data || [],
    totalCount: response.data?.length || 0,
    currentPage: params.page || 1,
    totalPages: Math.ceil((response.data?.length || 0) / (params.pageSize || 12)),
    hasNextPage: (response.data?.length || 0) >= (params.pageSize || 12),
    hasPreviousPage: (params.page || 1) > 1,
  };
};

/**
 * Get single announcement by ID with interactions
 */
export const getAnnouncementByIdRequest = async (announcementId: string): Promise<IAnnouncement> => {
  const queryParams: any = {};
  
  // Add user information for like status if user is authenticated
  try {
    const { authorId, authorType } = getCurrentUserInfo();
    queryParams.userId = authorId;
    queryParams.userType = authorType;
  } catch (error) {
    // User not authenticated - continue without user info
  }
  
  const response = await api.get(`/api/announcements/${announcementId}/interactions`, { params: queryParams });
  
  return response.data;
};

/**
 * Create new announcement
 */
export const createAnnouncementRequest = async (announcementData: ICreateAnnouncementRequest): Promise<IAnnouncement> => {
  const formData = new FormData();
  
  // Add association ID if provided
  if (announcementData.associationId) {
    formData.append('associationId', announcementData.associationId);
  }
  
  // Add text fields
  formData.append('title', announcementData.title);
  formData.append('content', announcementData.content);
  
  if (announcementData.eventId) {
    formData.append('eventId', announcementData.eventId);
  }
  
  // Add image file if provided
  if (announcementData.image) {
    formData.append('image', announcementData.image);
  }

  const response = await api.post('/api/announcements', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update existing announcement
 */
export const updateAnnouncementRequest = async (announcementId: string, announcementData: IUpdateAnnouncementRequest): Promise<void> => {
  const formData = new FormData();
  
  // Add text fields if provided
  if (announcementData.title !== undefined) {
    formData.append('title', announcementData.title);
  }
  
  if (announcementData.content !== undefined) {
    formData.append('content', announcementData.content);
  }
  
  // Add image file if provided
  if (announcementData.image) {
    formData.append('image', announcementData.image);
  }

  await api.put(`/api/announcements/${announcementId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Delete announcement
 */
export const deleteAnnouncementRequest = async (announcementId: string): Promise<void> => {
  await api.delete(`/api/announcements/${announcementId}`);
};

// Comment Operations

/**
 * Get comments for an announcement
 */
export const getAnnouncementCommentsRequest = async (announcementId: string): Promise<IAnnouncementComment[]> => {
  const response = await api.get(`/api/announcements/${announcementId}/comments`);
  return response.data;
};

/**
 * Create new comment
 */
export const createAnnouncementCommentRequest = async (announcementId: string, commentData: ICreateCommentRequest): Promise<{ id: string }> => {
  try {
    const { authorId, authorType } = getCurrentUserInfo();
    
    const requestData = {
      authorId,
      authorType,
      content: commentData.content,
      parentCommentId: commentData.parentId
    };

    const response = await api.post(`/api/announcements/${announcementId}/comments`, requestData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update existing comment
 */
export const updateAnnouncementCommentRequest = async (announcementId: string, commentId: string, commentData: IUpdateCommentRequest): Promise<void> => {
  await api.put(`/api/announcements/${announcementId}/comments/${commentId}`, commentData);
};

/**
 * Delete comment
 */
export const deleteAnnouncementCommentRequest = async (announcementId: string, commentId: string): Promise<void> => {
  await api.delete(`/api/announcements/${announcementId}/comments/${commentId}`);
};

// Like Operations

/**
 * Get likes for an announcement
 */
export const getAnnouncementLikesRequest = async (announcementId: string): Promise<IAnnouncementLike[]> => {
  const response = await api.get(`/api/announcements/${announcementId}/likes`);
  return response.data;
};

/**
 * Like an announcement
 */
export const likeAnnouncementRequest = async (announcementId: string): Promise<void> => {
  try {
    const { authorId, authorType } = getCurrentUserInfo();
    
    const requestData = {
      authorId,
      authorType
    };

    await api.post(`/api/announcements/${announcementId}/like`, requestData);
  } catch (error) {
    throw error;
  }
};

/**
 * Unlike an announcement
 */
export const unlikeAnnouncementRequest = async (announcementId: string): Promise<void> => {
  await api.delete(`/api/announcements/${announcementId}/like`);
};

// Statistics Operations

/**
 * Get statistics for an announcement
 */
export const getAnnouncementStatisticsRequest = async (announcementId: string): Promise<IAnnouncementStatistics> => {
  const response = await api.get(`/api/announcements/${announcementId}/statistics`);
  return response.data;
}; 