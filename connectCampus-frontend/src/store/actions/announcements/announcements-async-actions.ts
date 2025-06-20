import {
  getAnnouncementsRequest,
  getAnnouncementByIdRequest,
  createAnnouncementRequest,
  updateAnnouncementRequest,
  deleteAnnouncementRequest,
  getAnnouncementCommentsRequest,
  createAnnouncementCommentRequest,
  updateAnnouncementCommentRequest,
  deleteAnnouncementCommentRequest,
  getAnnouncementLikesRequest,
  likeAnnouncementRequest,
  unlikeAnnouncementRequest,
  getAnnouncementStatisticsRequest,
} from '@app/api/requests/announcement-requests';
import {
  IAnnouncementsFilter,
  ICreateAnnouncementRequest,
  IUpdateAnnouncementRequest,
  ICreateCommentRequest,
  IUpdateCommentRequest,
  IAnnouncement,
  IAnnouncementComment,
  IAnnouncementLike,
  IAnnouncementStatistics,
  IAnnouncementsResponse,
} from '@app/types/announcement';
import {
  GET_ANNOUNCEMENTS_ASYNC,
  GET_ANNOUNCEMENT_BY_ID_ASYNC,
  CREATE_ANNOUNCEMENT_ASYNC,
  UPDATE_ANNOUNCEMENT_ASYNC,
  DELETE_ANNOUNCEMENT_ASYNC,
  GET_ANNOUNCEMENT_COMMENTS_ASYNC,
  CREATE_ANNOUNCEMENT_COMMENT_ASYNC,
  UPDATE_ANNOUNCEMENT_COMMENT_ASYNC,
  DELETE_ANNOUNCEMENT_COMMENT_ASYNC,
  GET_ANNOUNCEMENT_LIKES_ASYNC,
  LIKE_ANNOUNCEMENT_ASYNC,
  UNLIKE_ANNOUNCEMENT_ASYNC,
  GET_ANNOUNCEMENT_STATISTICS_ASYNC,
} from '@app/store/constants';
import alertService from '@app/services/alert';
import ApiException from '@app/types/api/ApiException';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../index';
import {
  setAnnouncementsLoadingAction,
  setAnnouncementsErrorAction,
  setCommentsLoadingAction,
  setCommentsErrorAction,
  setLikesLoadingAction,
  setLikesErrorAction,
  setStatisticsLoadingAction,
} from './announcements-sync-actions';

// Announcement CRUD Operations

/**
 * Get announcements with pagination and filters
 */
export const getAnnouncementsActionAsync = createAsyncThunk<
  IAnnouncementsResponse | IAnnouncement[],
  IAnnouncementsFilter,
  { state: RootState }
>(GET_ANNOUNCEMENTS_ASYNC, async (params = {}, thunkApi) => {
  thunkApi.dispatch(setAnnouncementsLoadingAction(true));
  try {
    const result = await getAnnouncementsRequest(params);
    return result;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setAnnouncementsErrorAction(err instanceof Error ? err.message : 'Failed to fetch announcements'));
    throw err;
  } finally {
    thunkApi.dispatch(setAnnouncementsLoadingAction(false));
  }
});

/**
 * Load more announcements for infinite scroll
 */
export const loadMoreAnnouncementsActionAsync = createAsyncThunk<
  IAnnouncementsResponse | IAnnouncement[],
  IAnnouncementsFilter,
  { state: RootState }
>('LOAD_MORE_ANNOUNCEMENTS_ASYNC', async (params = {}, thunkApi) => {
  thunkApi.dispatch(setAnnouncementsLoadingAction(true));
  try {
    const result = await getAnnouncementsRequest(params);
    return result;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setAnnouncementsErrorAction(err instanceof Error ? err.message : 'Failed to load more announcements'));
    throw err;
  } finally {
    thunkApi.dispatch(setAnnouncementsLoadingAction(false));
  }
});

/**
 * Get single announcement by ID with interactions
 */
export const getAnnouncementByIdActionAsync = createAsyncThunk<
  IAnnouncement,
  string,
  { state: RootState }
>(GET_ANNOUNCEMENT_BY_ID_ASYNC, async (announcementId, thunkApi) => {
  thunkApi.dispatch(setAnnouncementsLoadingAction(true));
  try {
    const result = await getAnnouncementByIdRequest(announcementId);
    return result;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setAnnouncementsErrorAction(err instanceof Error ? err.message : 'Failed to fetch announcement'));
    throw err;
  } finally {
    thunkApi.dispatch(setAnnouncementsLoadingAction(false));
  }
});

/**
 * Create new announcement
 */
export const createAnnouncementActionAsync = createAsyncThunk<
  IAnnouncement,
  ICreateAnnouncementRequest,
  { state: RootState }
>(CREATE_ANNOUNCEMENT_ASYNC, async (announcementData, thunkApi) => {
  try {
    const result = await createAnnouncementRequest(announcementData);
    alertService.successAlert('Announcement created successfully!');
    return result;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setAnnouncementsErrorAction(err instanceof Error ? err.message : 'Failed to create announcement'));
    throw err;
  }
});

/**
 * Update existing announcement
 */
export const updateAnnouncementActionAsync = createAsyncThunk<
  string,
  { announcementId: string; announcementData: IUpdateAnnouncementRequest },
  { state: RootState }
>(UPDATE_ANNOUNCEMENT_ASYNC, async ({ announcementId, announcementData }, thunkApi) => {
  try {
    await updateAnnouncementRequest(announcementId, announcementData);
    alertService.successAlert('Announcement updated successfully!');
    return announcementId;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setAnnouncementsErrorAction(err instanceof Error ? err.message : 'Failed to update announcement'));
    throw err;
  }
});

/**
 * Delete announcement
 */
export const deleteAnnouncementActionAsync = createAsyncThunk<
  string,
  string,
  { state: RootState }
>(DELETE_ANNOUNCEMENT_ASYNC, async (announcementId, thunkApi) => {
  try {
    await deleteAnnouncementRequest(announcementId);
    alertService.successAlert('Announcement deleted successfully!');
    return announcementId;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setAnnouncementsErrorAction(err instanceof Error ? err.message : 'Failed to delete announcement'));
    throw err;
  }
});

// Comment Operations

/**
 * Get comments for an announcement
 */
export const getAnnouncementCommentsActionAsync = createAsyncThunk<
  { announcementId: string; comments: IAnnouncementComment[] },
  string,
  { state: RootState }
>(GET_ANNOUNCEMENT_COMMENTS_ASYNC, async (announcementId, thunkApi) => {
  thunkApi.dispatch(setCommentsLoadingAction(true));
  try {
    const result = await getAnnouncementCommentsRequest(announcementId);
    return { announcementId, comments: result };
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setCommentsErrorAction(err instanceof Error ? err.message : 'Failed to fetch comments'));
    throw err;
  } finally {
    thunkApi.dispatch(setCommentsLoadingAction(false));
  }
});

/**
 * Create new comment
 */
export const createAnnouncementCommentActionAsync = createAsyncThunk<
  { announcementId: string; commentId: string },
  { announcementId: string; commentData: ICreateCommentRequest },
  { state: RootState }
>(CREATE_ANNOUNCEMENT_COMMENT_ASYNC, async ({ announcementId, commentData }, thunkApi) => {
  try {
    const result = await createAnnouncementCommentRequest(announcementId, commentData);
    alertService.successAlert('Comment added successfully!');
    return { announcementId, commentId: result.id };
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setCommentsErrorAction(err instanceof Error ? err.message : 'Failed to create comment'));
    throw err;
  }
});

/**
 * Update existing comment
 */
export const updateAnnouncementCommentActionAsync = createAsyncThunk<
  { commentId: string; commentData: IUpdateCommentRequest },
  { announcementId: string; commentId: string; commentData: IUpdateCommentRequest },
  { state: RootState }
>(UPDATE_ANNOUNCEMENT_COMMENT_ASYNC, async ({ announcementId, commentId, commentData }, thunkApi) => {
  try {
    await updateAnnouncementCommentRequest(announcementId, commentId, commentData);
    alertService.successAlert('Comment updated successfully!');
    return { commentId, commentData };
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setCommentsErrorAction(err instanceof Error ? err.message : 'Failed to update comment'));
    throw err;
  }
});

/**
 * Delete comment
 */
export const deleteAnnouncementCommentActionAsync = createAsyncThunk<
  string,
  { announcementId: string; commentId: string },
  { state: RootState }
>(DELETE_ANNOUNCEMENT_COMMENT_ASYNC, async ({ announcementId, commentId }, thunkApi) => {
  try {
    await deleteAnnouncementCommentRequest(announcementId, commentId);
    alertService.successAlert('Comment deleted successfully!');
    return commentId;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setCommentsErrorAction(err instanceof Error ? err.message : 'Failed to delete comment'));
    throw err;
  }
});

// Like Operations

/**
 * Get likes for an announcement
 */
export const getAnnouncementLikesActionAsync = createAsyncThunk<
  { announcementId: string; likes: IAnnouncementLike[] },
  string,
  { state: RootState }
>(GET_ANNOUNCEMENT_LIKES_ASYNC, async (announcementId, thunkApi) => {
  thunkApi.dispatch(setLikesLoadingAction(true));
  try {
    const result = await getAnnouncementLikesRequest(announcementId);
    return { announcementId, likes: result };
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setLikesErrorAction(err instanceof Error ? err.message : 'Failed to fetch likes'));
    throw err;
  } finally {
    thunkApi.dispatch(setLikesLoadingAction(false));
  }
});

/**
 * Like an announcement
 */
export const likeAnnouncementActionAsync = createAsyncThunk<
  string,
  string,
  { state: RootState }
>(LIKE_ANNOUNCEMENT_ASYNC, async (announcementId, thunkApi) => {
  try {
    await likeAnnouncementRequest(announcementId);
    return announcementId;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setLikesErrorAction(err instanceof Error ? err.message : 'Failed to like announcement'));
    throw err;
  }
});

/**
 * Unlike an announcement
 */
export const unlikeAnnouncementActionAsync = createAsyncThunk<
  string,
  string,
  { state: RootState }
>(UNLIKE_ANNOUNCEMENT_ASYNC, async (announcementId, thunkApi) => {
  try {
    await unlikeAnnouncementRequest(announcementId);
    return announcementId;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(setLikesErrorAction(err instanceof Error ? err.message : 'Failed to unlike announcement'));
    throw err;
  }
});

// Statistics Operations

/**
 * Get statistics for an announcement
 */
export const getAnnouncementStatisticsActionAsync = createAsyncThunk<
  { announcementId: string; statistics: IAnnouncementStatistics },
  string,
  { state: RootState }
>(GET_ANNOUNCEMENT_STATISTICS_ASYNC, async (announcementId, thunkApi) => {
  thunkApi.dispatch(setStatisticsLoadingAction(true));
  try {
    const result = await getAnnouncementStatisticsRequest(announcementId);
    return { announcementId, statistics: result };
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setStatisticsLoadingAction(false));
  }
}); 