import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { IAnnouncementsState } from '@app/types/announcement/IAnnouncementsState';
import { IAnnouncementComment } from '@app/types/announcement';

// Base selectors
export const announcementsStateSelector = (state: RootState): IAnnouncementsState => state.announcements;

// Announcements data selectors
export const announcementsSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.announcements
);

export const currentAnnouncementSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.currentAnnouncement
);

// Pagination selectors
export const announcementsPaginationSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => ({
    totalCount: announcementsState.totalCount,
    currentPage: announcementsState.currentPage,
    totalPages: announcementsState.totalPages,
    hasNextPage: announcementsState.hasNextPage,
    hasPreviousPage: announcementsState.hasPreviousPage,
  })
);

// Comments selectors
export const announcementCommentsSelector = createSelector(
  [announcementsStateSelector, (_: RootState, announcementId: string) => announcementId],
  (announcementsState, announcementId) => announcementsState.comments[announcementId] || []
);

export const allCommentsSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.comments
);

// Likes selectors
export const announcementLikesSelector = createSelector(
  [announcementsStateSelector, (_: RootState, announcementId: string) => announcementId],
  (announcementsState, announcementId) => announcementsState.likes[announcementId] || []
);

export const allLikesSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.likes
);

// Statistics selectors
export const announcementStatisticsSelector = createSelector(
  [announcementsStateSelector, (_: RootState, announcementId: string) => announcementId],
  (announcementsState, announcementId) => announcementsState.statistics[announcementId]
);

// Loading state selectors
export const announcementsLoadingSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.isLoading
);

export const commentsLoadingSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.isLoadingComments
);

export const likesLoadingSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.isLoadingLikes
);

export const statisticsLoadingSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.isLoadingStatistics
);

// Action loading state selectors
export const createAnnouncementLoadingSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.isCreatingAnnouncement
);

export const updateAnnouncementLoadingSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.isUpdatingAnnouncement
);

export const deleteAnnouncementLoadingSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.isDeletingAnnouncement
);

export const likeAnnouncementLoadingSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.isLikingAnnouncement
);

export const createCommentLoadingSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.isCreatingComment
);

export const updateCommentLoadingSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.isUpdatingComment
);

export const deleteCommentLoadingSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.isDeletingComment
);

// Error selectors
export const announcementsErrorSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.error
);

export const commentsErrorSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.commentError
);

export const likesErrorSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.likeError
);

// Filter selectors
export const announcementsSearchQuerySelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.searchQuery
);

export const announcementsFilterTypeSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.filterType
);

// Cache selectors
export const announcementsLastFetchedSelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.lastFetched
);

export const announcementsCacheExpirySelector = createSelector(
  [announcementsStateSelector],
  (announcementsState) => announcementsState.cacheExpiry
);

// Computed selectors
export const isAnnouncementsCacheValidSelector = createSelector(
  [announcementsLastFetchedSelector, announcementsCacheExpirySelector],
  (lastFetched, cacheExpiry) => {
    if (!lastFetched) return false;
    return Date.now() - lastFetched < cacheExpiry;
  }
);

// Filtered announcements selector
export const filteredAnnouncementsSelector = createSelector(
  [announcementsSelector, announcementsSearchQuerySelector, announcementsFilterTypeSelector],
  (announcements, searchQuery, filterType) => {
    // Ensure announcements is an array
    if (!announcements || !Array.isArray(announcements)) {
      return [];
    }

    let filtered = [...announcements];

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(announcement => {
        const title = announcement.title || '';
        const content = announcement.content || '';
        const associationName = announcement.association?.name || '';
        
        return title.toLowerCase().includes(query) ||
               content.toLowerCase().includes(query) ||
               associationName.toLowerCase().includes(query);
      });
    }

    // Apply type filter
    if (filterType === 'events') {
      filtered = filtered.filter(announcement => announcement.eventId !== null && announcement.eventId !== undefined);
    } else if (filterType === 'general') {
      filtered = filtered.filter(announcement => !announcement.eventId);
    }

    return filtered;
  }
);

// Comments count selector for specific announcement
export const announcementCommentsCountSelector = createSelector(
  [announcementCommentsSelector],
  (comments) => {
    const countCommentsRecursively = (commentsList: IAnnouncementComment[]): number => {
      let count = commentsList.length;
      commentsList.forEach(comment => {
        if (comment.replies) {
          count += countCommentsRecursively(comment.replies);
        }
      });
      return count;
    };
    
    return countCommentsRecursively(comments);
  }
);

// Announcement by ID selector
export const announcementByIdSelector = createSelector(
  [announcementsSelector, (_: RootState, announcementId: string) => announcementId],
  (announcements, announcementId) => {
    if (!announcements || !Array.isArray(announcements)) {
      return undefined;
    }
    return announcements.find(announcement => announcement.id === announcementId);
  }
);

// Any loading selector - useful for global loading indicators
export const anyAnnouncementLoadingSelector = createSelector(
  [
    announcementsLoadingSelector,
    commentsLoadingSelector,
    likesLoadingSelector,
    statisticsLoadingSelector,
    createAnnouncementLoadingSelector,
    updateAnnouncementLoadingSelector,
    deleteAnnouncementLoadingSelector,
    likeAnnouncementLoadingSelector,
    createCommentLoadingSelector,
    updateCommentLoadingSelector,
    deleteCommentLoadingSelector,
  ],
  (...loadingStates) => loadingStates.some(loading => loading)
); 
 
 