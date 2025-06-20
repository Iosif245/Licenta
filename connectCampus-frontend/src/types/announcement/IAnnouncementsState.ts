import { IAnnouncement, IAnnouncementComment, IAnnouncementLike, IAnnouncementStatistics } from '../announcement';

export interface IAnnouncementsState {
  // Main announcements data
  announcements: IAnnouncement[];
  currentAnnouncement: IAnnouncement | null;
  
  // Pagination
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  
  // Comments data
  comments: { [announcementId: string]: IAnnouncementComment[] };
  
  // Likes data
  likes: { [announcementId: string]: IAnnouncementLike[] };
  
  // Statistics
  statistics: { [announcementId: string]: IAnnouncementStatistics };
  
  // Loading states
  isLoading: boolean;
  isLoadingComments: boolean;
  isLoadingLikes: boolean;
  isLoadingStatistics: boolean;
  
  // Action loading states
  isCreatingAnnouncement: boolean;
  isUpdatingAnnouncement: boolean;
  isDeletingAnnouncement: boolean;
  isLikingAnnouncement: boolean;
  isCreatingComment: boolean;
  isUpdatingComment: boolean;
  isDeletingComment: boolean;
  
  // Error states
  error: string | null;
  commentError: string | null;
  likeError: string | null;
  
  // Filters and search
  searchQuery: string;
  filterType: 'all' | 'events' | 'general';
  
  // Cache timestamps for data freshness
  lastFetched: number | null;
  cacheExpiry: number; // in milliseconds
} 
 
 