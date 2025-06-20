import { createReducer } from '@reduxjs/toolkit';
import { IAnnouncementsState } from '@app/types/announcement/IAnnouncementsState';
import {
  // Sync actions
  setAnnouncementsAction,
  appendAnnouncementsAction,
  setCurrentAnnouncementAction,
  setAnnouncementsLoadingAction,
  setAnnouncementsErrorAction,
  clearAnnouncementsErrorAction,
  setAnnouncementsPaginationAction,
  setAnnouncementsFiltersAction,
  clearAnnouncementsFiltersAction,
  setAnnouncementCommentsAction,
  addAnnouncementCommentAction,
  updateAnnouncementCommentAction,
  deleteAnnouncementCommentAction,
  setCommentsLoadingAction,
  setCommentsErrorAction,
  setAnnouncementLikesAction,
  addAnnouncementLikeAction,
  removeAnnouncementLikeAction,
  setLikesLoadingAction,
  setLikesErrorAction,
  setAnnouncementStatisticsAction,
  setStatisticsLoadingAction,
} from '../actions/announcements/announcements-sync-actions';
import {
  // Async actions
  getAnnouncementsActionAsync,
  getAnnouncementByIdActionAsync,
  createAnnouncementActionAsync,
  updateAnnouncementActionAsync,
  deleteAnnouncementActionAsync,
  getAnnouncementCommentsActionAsync,
  createAnnouncementCommentActionAsync,
  updateAnnouncementCommentActionAsync,
  deleteAnnouncementCommentActionAsync,
  getAnnouncementLikesActionAsync,
  likeAnnouncementActionAsync,
  unlikeAnnouncementActionAsync,
  getAnnouncementStatisticsActionAsync,
  loadMoreAnnouncementsActionAsync,
} from '../actions/announcements/announcements-async-actions';

const initialState: IAnnouncementsState = {
  // Main announcements data
  announcements: [],
  currentAnnouncement: null,
  
  // Pagination
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  
  // Comments data
  comments: {},
  
  // Likes data
  likes: {},
  
  // Statistics
  statistics: {},
  
  // Loading states
  isLoading: false,
  isLoadingComments: false,
  isLoadingLikes: false,
  isLoadingStatistics: false,
  
  // Action loading states
  isCreatingAnnouncement: false,
  isUpdatingAnnouncement: false,
  isDeletingAnnouncement: false,
  isLikingAnnouncement: false,
  isCreatingComment: false,
  isUpdatingComment: false,
  isDeletingComment: false,
  
  // Error states
  error: null,
  commentError: null,
  likeError: null,
  
  // Filters and search
  searchQuery: '',
  filterType: 'all',
  
  // Cache timestamps for data freshness
  lastFetched: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
};

const announcementsReducer = createReducer(initialState, builder => {
  builder
    // Sync actions
    .addCase(setAnnouncementsAction, (state, action) => {
      state.announcements = action.payload.announcements;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.hasNextPage = action.payload.hasNextPage;
      state.hasPreviousPage = action.payload.hasPreviousPage;
      state.lastFetched = Date.now();
    })
    .addCase(appendAnnouncementsAction, (state, action) => {
      state.announcements = [...state.announcements, ...action.payload.announcements];
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.hasNextPage = action.payload.hasNextPage;
      state.hasPreviousPage = action.payload.hasPreviousPage;
      state.lastFetched = Date.now();
    })
    .addCase(setCurrentAnnouncementAction, (state, action) => {
      state.currentAnnouncement = action.payload;
    })
    .addCase(setAnnouncementsLoadingAction, (state, action) => {
      state.isLoading = action.payload;
    })
    .addCase(setAnnouncementsErrorAction, (state, action) => {
      state.error = action.payload;
    })
    .addCase(clearAnnouncementsErrorAction, (state) => {
      state.error = null;
    })
    .addCase(setAnnouncementsPaginationAction, (state, action) => {
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.hasNextPage = action.payload.hasNextPage;
      state.hasPreviousPage = action.payload.hasPreviousPage;
    })
    .addCase(setAnnouncementsFiltersAction, (state, action) => {
      const payload = action.payload as { searchQuery?: string; filterType?: 'all' | 'events' | 'general' };
      if (payload.searchQuery !== undefined) {
        state.searchQuery = payload.searchQuery;
      }
      if (payload.filterType !== undefined) {
        state.filterType = payload.filterType;
      }
    })
    .addCase(clearAnnouncementsFiltersAction, (state) => {
      state.searchQuery = '';
      state.filterType = 'all';
    })

    // Comment sync actions
    .addCase(setAnnouncementCommentsAction, (state, action) => {
      state.comments[action.payload.announcementId] = action.payload.comments;
    })
    .addCase(addAnnouncementCommentAction, (state, action) => {
      const { announcementId, comment } = action.payload;
      if (!state.comments[announcementId]) {
        state.comments[announcementId] = [];
      }
      
      if (comment.parentCommentId) {
        // Add as reply
        const parentComment = state.comments[announcementId].find(c => c.id === comment.parentCommentId);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(comment);
        }
      } else {
        // Add as top-level comment
        state.comments[announcementId].push(comment);
      }
      
      // Update comment count
      const announcement = state.announcements.find(ann => ann.id === announcementId);
      if (announcement) {
        announcement.commentsCount += 1;
      }
      if (state.currentAnnouncement && state.currentAnnouncement.id === announcementId) {
        state.currentAnnouncement.commentsCount += 1;
      }
    })
    .addCase(updateAnnouncementCommentAction, (state, action) => {
      const { commentId, content } = action.payload;
      
      Object.keys(state.comments).forEach(announcementId => {
        const comments = state.comments[announcementId];
        const updateCommentRecursively = (commentsList: typeof comments) => {
          commentsList.forEach(comment => {
            if (comment.id === commentId) {
              comment.content = content;
              comment.updatedAt = new Date().toISOString();
            }
            if (comment.replies) {
              updateCommentRecursively(comment.replies);
            }
          });
        };
        updateCommentRecursively(comments);
      });
    })
    .addCase(deleteAnnouncementCommentAction, (state, action) => {
      const commentId = action.payload;
      
      Object.keys(state.comments).forEach(announcementId => {
        const comments = state.comments[announcementId];
        let deletedCount = 0;
        
        const removeCommentRecursively = (commentsList: typeof comments): typeof comments => {
          return commentsList.filter(comment => {
            if (comment.id === commentId) {
              const countReplies = (c: typeof comment): number => {
                let count = 1;
                if (c.replies) {
                  c.replies.forEach((reply) => {
                    count += countReplies(reply);
                  });
                }
                return count;
              };
              deletedCount = countReplies(comment);
              return false;
            }
            if (comment.replies) {
              comment.replies = removeCommentRecursively(comment.replies);
            }
            return true;
          });
        };
        
        state.comments[announcementId] = removeCommentRecursively(comments);
        
        if (deletedCount > 0) {
          const announcement = state.announcements.find(ann => ann.id === announcementId);
          if (announcement) {
            announcement.commentsCount = Math.max(0, announcement.commentsCount - deletedCount);
          }
          if (state.currentAnnouncement && state.currentAnnouncement.id === announcementId) {
            state.currentAnnouncement.commentsCount = Math.max(0, state.currentAnnouncement.commentsCount - deletedCount);
          }
        }
      });
    })
    .addCase(setCommentsLoadingAction, (state, action) => {
      state.isLoadingComments = action.payload;
    })
    .addCase(setCommentsErrorAction, (state, action) => {
      state.commentError = action.payload;
    })

    // Like sync actions
    .addCase(setAnnouncementLikesAction, (state, action) => {
      state.likes[action.payload.announcementId] = action.payload.likes;
    })
    .addCase(addAnnouncementLikeAction, (state, action) => {
      const announcementId = action.payload;
      
      const announcement = state.announcements.find(ann => ann.id === announcementId);
      if (announcement) {
        announcement.likesCount += 1;
        announcement.isLiked = true;
      }
      
      if (state.currentAnnouncement && state.currentAnnouncement.id === announcementId) {
        state.currentAnnouncement.likesCount += 1;
        state.currentAnnouncement.isLiked = true;
      }
    })
    .addCase(removeAnnouncementLikeAction, (state, action) => {
      const announcementId = action.payload;
      
      const announcement = state.announcements.find(ann => ann.id === announcementId);
      if (announcement) {
        announcement.likesCount = Math.max(0, announcement.likesCount - 1);
        announcement.isLiked = false;
      }
      
      if (state.currentAnnouncement && state.currentAnnouncement.id === announcementId) {
        state.currentAnnouncement.likesCount = Math.max(0, state.currentAnnouncement.likesCount - 1);
        state.currentAnnouncement.isLiked = false;
      }
    })
    .addCase(setLikesLoadingAction, (state, action) => {
      state.isLoadingLikes = action.payload;
    })
    .addCase(setLikesErrorAction, (state, action) => {
      state.likeError = action.payload;
    })

    // Statistics sync actions
    .addCase(setAnnouncementStatisticsAction, (state, action) => {
      state.statistics[action.payload.announcementId] = action.payload.statistics;
    })
    .addCase(setStatisticsLoadingAction, (state, action) => {
      state.isLoadingStatistics = action.payload;
    })

    // Async actions - Get Announcements
    .addCase(getAnnouncementsActionAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAnnouncementsActionAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Handle both paginated response and direct array response
      if (Array.isArray(action.payload)) {
        // Direct array response from backend
        state.announcements = action.payload;
        state.totalCount = action.payload.length;
        state.currentPage = 1;
        state.totalPages = 1;
        state.hasNextPage = false;
        state.hasPreviousPage = false;
      } else {
        // Paginated response
        state.announcements = action.payload.announcements;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.hasNextPage = action.payload.hasNextPage;
        state.hasPreviousPage = action.payload.hasPreviousPage;
      }
      
      state.lastFetched = Date.now();
      state.error = null;
    })
    .addCase(getAnnouncementsActionAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to fetch announcements';
    })

    // Load More Announcements (for infinite scroll)
    .addCase(loadMoreAnnouncementsActionAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loadMoreAnnouncementsActionAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Handle both paginated response and direct array response
      if (Array.isArray(action.payload)) {
        // Direct array response from backend - append to existing
        state.announcements = [...state.announcements, ...action.payload];
        state.totalCount = state.announcements.length;
        state.currentPage = 1;
        state.totalPages = 1;
        state.hasNextPage = false;
        state.hasPreviousPage = false;
      } else {
        // Paginated response
        state.announcements = [...state.announcements, ...action.payload.announcements];
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.hasNextPage = action.payload.hasNextPage;
        state.hasPreviousPage = action.payload.hasPreviousPage;
      }
      
      state.lastFetched = Date.now();
      state.error = null;
    })
    .addCase(loadMoreAnnouncementsActionAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to load more announcements';
    })

    // Get Announcement By ID
    .addCase(getAnnouncementByIdActionAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getAnnouncementByIdActionAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentAnnouncement = action.payload;
      
      // Update announcement in list if it exists
      const index = state.announcements.findIndex(ann => ann.id === action.payload.id);
      if (index !== -1) {
        state.announcements[index] = action.payload;
      }
      state.error = null;
    })
    .addCase(getAnnouncementByIdActionAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to fetch announcement';
    })

    // Create Announcement
    .addCase(createAnnouncementActionAsync.pending, (state) => {
      state.isCreatingAnnouncement = true;
      state.error = null;
    })
    .addCase(createAnnouncementActionAsync.fulfilled, (state, action) => {
      state.isCreatingAnnouncement = false;
      state.announcements.unshift(action.payload);
      state.totalCount += 1;
      state.error = null;
    })
    .addCase(createAnnouncementActionAsync.rejected, (state, action) => {
      state.isCreatingAnnouncement = false;
      state.error = action.error.message || 'Failed to create announcement';
    })

    // Update Announcement
    .addCase(updateAnnouncementActionAsync.pending, (state) => {
      state.isUpdatingAnnouncement = true;
      state.error = null;
    })
    .addCase(updateAnnouncementActionAsync.fulfilled, (state, action) => {
      state.isUpdatingAnnouncement = false;
      
      // Update in current announcement if it's the same
      if (state.currentAnnouncement && state.currentAnnouncement.id === action.payload) {
        state.currentAnnouncement.updatedAt = new Date().toISOString();
      }
      
      // Update in announcements list
      const index = state.announcements.findIndex(ann => ann.id === action.payload);
      if (index !== -1) {
        state.announcements[index].updatedAt = new Date().toISOString();
      }
      state.error = null;
    })
    .addCase(updateAnnouncementActionAsync.rejected, (state, action) => {
      state.isUpdatingAnnouncement = false;
      state.error = action.error.message || 'Failed to update announcement';
    })

    // Delete Announcement
    .addCase(deleteAnnouncementActionAsync.pending, (state) => {
      state.isDeletingAnnouncement = true;
      state.error = null;
    })
    .addCase(deleteAnnouncementActionAsync.fulfilled, (state, action) => {
      state.isDeletingAnnouncement = false;
      
      // Remove from announcements list
      state.announcements = state.announcements.filter(ann => ann.id !== action.payload);
      state.totalCount = Math.max(0, state.totalCount - 1);
      
      // Clear current announcement if it was deleted
      if (state.currentAnnouncement && state.currentAnnouncement.id === action.payload) {
        state.currentAnnouncement = null;
      }
      
      // Clean up related data
      delete state.comments[action.payload];
      delete state.likes[action.payload];
      delete state.statistics[action.payload];
      
      state.error = null;
    })
    .addCase(deleteAnnouncementActionAsync.rejected, (state, action) => {
      state.isDeletingAnnouncement = false;
      state.error = action.error.message || 'Failed to delete announcement';
    })

    // Get Comments
    .addCase(getAnnouncementCommentsActionAsync.pending, (state) => {
      state.isLoadingComments = true;
      state.commentError = null;
    })
    .addCase(getAnnouncementCommentsActionAsync.fulfilled, (state, action) => {
      state.isLoadingComments = false;
      state.comments[action.payload.announcementId] = action.payload.comments;
      state.commentError = null;
    })
    .addCase(getAnnouncementCommentsActionAsync.rejected, (state, action) => {
      state.isLoadingComments = false;
      state.commentError = action.error.message || 'Failed to fetch comments';
    })

    // Create Comment
    .addCase(createAnnouncementCommentActionAsync.pending, (state) => {
      state.isCreatingComment = true;
      state.commentError = null;
    })
    .addCase(createAnnouncementCommentActionAsync.fulfilled, (state) => {
      state.isCreatingComment = false;
      // Don't add the comment to state here since the backend only returns the ID
      // The comment will be added when the comments are refetched
      state.commentError = null;
    })
    .addCase(createAnnouncementCommentActionAsync.rejected, (state, action) => {
      state.isCreatingComment = false;
      state.commentError = action.error.message || 'Failed to create comment';
    })

    // Update Comment
    .addCase(updateAnnouncementCommentActionAsync.pending, (state) => {
      state.isUpdatingComment = true;
      state.commentError = null;
    })
    .addCase(updateAnnouncementCommentActionAsync.fulfilled, (state, action) => {
      state.isUpdatingComment = false;
      const { commentId, commentData } = action.payload;
      
      // Find and update comment in all announcements
      Object.keys(state.comments).forEach(announcementId => {
        const comments = state.comments[announcementId];
        const updateCommentRecursively = (commentsList: typeof comments) => {
          commentsList.forEach(comment => {
            if (comment.id === commentId) {
              comment.content = commentData.content;
              comment.updatedAt = new Date().toISOString();
            }
            if (comment.replies) {
              updateCommentRecursively(comment.replies);
            }
          });
        };
        updateCommentRecursively(comments);
      });
      
      state.commentError = null;
    })
    .addCase(updateAnnouncementCommentActionAsync.rejected, (state, action) => {
      state.isUpdatingComment = false;
      state.commentError = action.error.message || 'Failed to update comment';
    })

    // Delete Comment
    .addCase(deleteAnnouncementCommentActionAsync.pending, (state) => {
      state.isDeletingComment = true;
      state.commentError = null;
    })
    .addCase(deleteAnnouncementCommentActionAsync.fulfilled, (state, action) => {
      state.isDeletingComment = false;
      const commentId = action.payload;
      
      // Find and remove comment from all announcements
      Object.keys(state.comments).forEach(announcementId => {
        const comments = state.comments[announcementId];
        let deletedCount = 0;
        
        const removeCommentRecursively = (commentsList: typeof comments): typeof comments => {
          return commentsList.filter(comment => {
            if (comment.id === commentId) {
              // Count this comment and all its replies
              const countReplies = (c: typeof comment): number => {
                let count = 1;
                if (c.replies) {
                  c.replies.forEach((reply) => {
                    count += countReplies(reply);
                  });
                }
                return count;
              };
              deletedCount = countReplies(comment);
              return false;
            }
            if (comment.replies) {
              comment.replies = removeCommentRecursively(comment.replies);
            }
            return true;
          });
        };
        
        state.comments[announcementId] = removeCommentRecursively(comments);
        
        // Update comment count in announcements
        if (deletedCount > 0) {
          const announcement = state.announcements.find(ann => ann.id === announcementId);
          if (announcement) {
            announcement.commentsCount = Math.max(0, announcement.commentsCount - deletedCount);
          }
          
          // Update current announcement
          if (state.currentAnnouncement && state.currentAnnouncement.id === announcementId) {
            state.currentAnnouncement.commentsCount = Math.max(0, state.currentAnnouncement.commentsCount - deletedCount);
          }
        }
      });
      
      state.commentError = null;
    })
    .addCase(deleteAnnouncementCommentActionAsync.rejected, (state, action) => {
      state.isDeletingComment = false;
      state.commentError = action.error.message || 'Failed to delete comment';
    })

    // Get Likes
    .addCase(getAnnouncementLikesActionAsync.pending, (state) => {
      state.isLoadingLikes = true;
      state.likeError = null;
    })
    .addCase(getAnnouncementLikesActionAsync.fulfilled, (state, action) => {
      state.isLoadingLikes = false;
      state.likes[action.payload.announcementId] = action.payload.likes;
      state.likeError = null;
    })
    .addCase(getAnnouncementLikesActionAsync.rejected, (state, action) => {
      state.isLoadingLikes = false;
      state.likeError = action.error.message || 'Failed to fetch likes';
    })

    // Like Announcement
    .addCase(likeAnnouncementActionAsync.pending, (state) => {
      state.isLikingAnnouncement = true;
      state.likeError = null;
    })
    .addCase(likeAnnouncementActionAsync.fulfilled, (state, action) => {
      state.isLikingAnnouncement = false;
      const announcementId = action.payload;
      
      // Update like count and status in announcements
      const announcement = state.announcements.find(ann => ann.id === announcementId);
      if (announcement) {
        // Toggle like status
        if (announcement.isLiked) {
          // Unlike
          announcement.likesCount = Math.max(0, announcement.likesCount - 1);
          announcement.isLiked = false;
        } else {
          // Like
          announcement.likesCount += 1;
          announcement.isLiked = true;
        }
      }
      
      // Update current announcement
      if (state.currentAnnouncement && state.currentAnnouncement.id === announcementId) {
        if (state.currentAnnouncement.isLiked) {
          // Unlike
          state.currentAnnouncement.likesCount = Math.max(0, state.currentAnnouncement.likesCount - 1);
          state.currentAnnouncement.isLiked = false;
        } else {
          // Like
          state.currentAnnouncement.likesCount += 1;
          state.currentAnnouncement.isLiked = true;
        }
      }
      
      state.likeError = null;
    })
    .addCase(likeAnnouncementActionAsync.rejected, (state, action) => {
      state.isLikingAnnouncement = false;
      state.likeError = action.error.message || 'Failed to toggle like';
    })

    // Unlike Announcement
    .addCase(unlikeAnnouncementActionAsync.pending, (state) => {
      state.isLikingAnnouncement = true;
      state.likeError = null;
    })
    .addCase(unlikeAnnouncementActionAsync.fulfilled, (state, action) => {
      state.isLikingAnnouncement = false;
      const announcementId = action.payload;
      
      // Update like count and status in announcements
      const announcement = state.announcements.find(ann => ann.id === announcementId);
      if (announcement) {
        announcement.likesCount = Math.max(0, announcement.likesCount - 1);
        announcement.isLiked = false;
      }
      
      // Update current announcement
      if (state.currentAnnouncement && state.currentAnnouncement.id === announcementId) {
        state.currentAnnouncement.likesCount = Math.max(0, state.currentAnnouncement.likesCount - 1);
        state.currentAnnouncement.isLiked = false;
      }
      
      state.likeError = null;
    })
    .addCase(unlikeAnnouncementActionAsync.rejected, (state, action) => {
      state.isLikingAnnouncement = false;
      state.likeError = action.error.message || 'Failed to unlike announcement';
    })

    // Get Statistics
    .addCase(getAnnouncementStatisticsActionAsync.pending, (state) => {
      state.isLoadingStatistics = true;
    })
    .addCase(getAnnouncementStatisticsActionAsync.fulfilled, (state, action) => {
      state.isLoadingStatistics = false;
      state.statistics[action.payload.announcementId] = action.payload.statistics;
    })
    .addCase(getAnnouncementStatisticsActionAsync.rejected, (state) => {
      state.isLoadingStatistics = false;
    });
});

export default announcementsReducer; 