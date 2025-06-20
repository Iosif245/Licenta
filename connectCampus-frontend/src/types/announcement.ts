export interface IAnnouncement {
  id: string;
  associationId: string;
  eventId?: string;
  title: string;
  content: string;
  imageUrl?: string;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
  association: {
    name: string;
    logoUrl?: string;
    isVerified: boolean;
  };
  event?: {
    title: string;
    startDate: string;
    endDate?: string;
    location?: string;
    maxParticipants?: number;
    registrationUrl?: string;
  };
  commentsCount: number;
  likesCount: number;
  viewsCount?: number;
  isLiked: boolean;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export interface IAnnouncementComment {
  id: string;
  announcementId: string;
  authorId: string;
  authorType: string;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentCommentId?: string;
  replies?: IAnnouncementComment[];
}

export interface IAnnouncementLike {
  id: string;
  announcementId: string;
  userId: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface IAnnouncementStatistics {
  totalLikes: number;
  totalComments: number;
  recentActivity: {
    likesLast24h: number;
    commentsLast24h: number;
    likesLast7d: number;
    commentsLast7d: number;
  };
  topCommenters: Array<{
    userId: string;
    firstName: string;
    lastName: string;
    commentCount: number;
  }>;
}

export interface ICreateAnnouncementRequest {
  associationId?: string;
  title: string;
  content: string;
  image?: File;
  eventId?: string;
}

export interface IUpdateAnnouncementRequest {
  title?: string;
  content?: string;
  image?: File;
}

export interface ICreateCommentRequest {
  content: string;
  parentId?: string;
}

export interface IUpdateCommentRequest {
  content: string;
}

export interface IAnnouncementsFilter {
  page?: number;
  pageSize?: number;
  associationId?: string;
  eventId?: string;
  search?: string;
  type?: 'all' | 'events' | 'general';
}

export interface IAnnouncementsResponse {
  announcements: IAnnouncement[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
