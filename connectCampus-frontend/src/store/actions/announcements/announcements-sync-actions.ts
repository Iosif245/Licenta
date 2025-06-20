import { createAction } from '@reduxjs/toolkit';
import {
  SET_ANNOUNCEMENTS,
  APPEND_ANNOUNCEMENTS,
  SET_CURRENT_ANNOUNCEMENT,
  SET_ANNOUNCEMENTS_LOADING,
  SET_ANNOUNCEMENTS_ERROR,
  CLEAR_ANNOUNCEMENTS_ERROR,
  SET_ANNOUNCEMENTS_PAGINATION,
  SET_ANNOUNCEMENTS_FILTERS,
  CLEAR_ANNOUNCEMENTS_FILTERS,
  SET_ANNOUNCEMENT_COMMENTS,
  ADD_ANNOUNCEMENT_COMMENT,
  UPDATE_ANNOUNCEMENT_COMMENT,
  DELETE_ANNOUNCEMENT_COMMENT,
  SET_COMMENTS_LOADING,
  SET_COMMENTS_ERROR,
  SET_ANNOUNCEMENT_LIKES,
  ADD_ANNOUNCEMENT_LIKE,
  REMOVE_ANNOUNCEMENT_LIKE,
  SET_LIKES_LOADING,
  SET_LIKES_ERROR,
  SET_ANNOUNCEMENT_STATISTICS,
  SET_STATISTICS_LOADING,
} from '../../constants';
import { IAnnouncement, IAnnouncementComment, IAnnouncementLike, IAnnouncementStatistics } from '@app/types/announcement';

// Main announcements actions
export const setAnnouncementsAction = createAction<{
  announcements: IAnnouncement[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}>(SET_ANNOUNCEMENTS);

export const appendAnnouncementsAction = createAction<{
  announcements: IAnnouncement[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}>(APPEND_ANNOUNCEMENTS);

export const setCurrentAnnouncementAction = createAction<IAnnouncement | null>(SET_CURRENT_ANNOUNCEMENT);

export const setAnnouncementsLoadingAction = createAction<boolean>(SET_ANNOUNCEMENTS_LOADING);

export const setAnnouncementsErrorAction = createAction<string | null>(SET_ANNOUNCEMENTS_ERROR);

export const clearAnnouncementsErrorAction = createAction<void>(CLEAR_ANNOUNCEMENTS_ERROR);

// Pagination actions
export const setAnnouncementsPaginationAction = createAction<{
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}>(SET_ANNOUNCEMENTS_PAGINATION);

// Filter actions
export const setAnnouncementsFiltersAction = createAction<{
  searchQuery?: string;
  filterType?: 'all' | 'events' | 'general';
}>(SET_ANNOUNCEMENTS_FILTERS);

export const clearAnnouncementsFiltersAction = createAction<void>(CLEAR_ANNOUNCEMENTS_FILTERS);

// Comment actions
export const setAnnouncementCommentsAction = createAction<{
  announcementId: string;
  comments: IAnnouncementComment[];
}>(SET_ANNOUNCEMENT_COMMENTS);

export const addAnnouncementCommentAction = createAction<{
  announcementId: string;
  comment: IAnnouncementComment;
}>(ADD_ANNOUNCEMENT_COMMENT);

export const updateAnnouncementCommentAction = createAction<{
  commentId: string;
  content: string;
}>(UPDATE_ANNOUNCEMENT_COMMENT);

export const deleteAnnouncementCommentAction = createAction<string>(DELETE_ANNOUNCEMENT_COMMENT);

export const setCommentsLoadingAction = createAction<boolean>(SET_COMMENTS_LOADING);

export const setCommentsErrorAction = createAction<string | null>(SET_COMMENTS_ERROR);

// Like actions
export const setAnnouncementLikesAction = createAction<{
  announcementId: string;
  likes: IAnnouncementLike[];
}>(SET_ANNOUNCEMENT_LIKES);

export const addAnnouncementLikeAction = createAction<string>(ADD_ANNOUNCEMENT_LIKE);

export const removeAnnouncementLikeAction = createAction<string>(REMOVE_ANNOUNCEMENT_LIKE);

export const setLikesLoadingAction = createAction<boolean>(SET_LIKES_LOADING);

export const setLikesErrorAction = createAction<string | null>(SET_LIKES_ERROR);

// Statistics actions
export const setAnnouncementStatisticsAction = createAction<{
  announcementId: string;
  statistics: IAnnouncementStatistics;
}>(SET_ANNOUNCEMENT_STATISTICS);

export const setStatisticsLoadingAction = createAction<boolean>(SET_STATISTICS_LOADING); 
 
 