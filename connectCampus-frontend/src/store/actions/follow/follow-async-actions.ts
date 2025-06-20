import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';
import {
  FOLLOW__FOLLOW_ASSOCIATION,
  FOLLOW__UNFOLLOW_ASSOCIATION,
  FOLLOW__GET_FOLLOWERS,
  FOLLOW__GET_FOLLOWS,
  FOLLOW__CHECK_STATUS,
  FOLLOW__GET_NOTIFICATIONS,
} from '@app/store/constants';
import ApiException from '@app/types/api/ApiException';
import {
  followAssociationRequest,
  unfollowAssociationRequest,
  checkFollowStatusRequest,
  getAssociationFollowersRequest,
  getStudentFollowsRequest,
  getStudentFollowsPagedRequest,
  getFollowNotificationsRequest,
  markFollowNotificationReadRequest,
} from '@app/api/requests/follow-requests';
import alertService from '@app/services/alert';
import {
  // setFollowStatsAction, // Commented out - deprecated
  setFollowersListAction,
  setFollowingListAction,
  setFollowLoadingAction,
  addFollowAction,
  removeFollowAction,
  setFollowStatusAction,
  setFollowNotificationsAction,
} from './follow-sync-actions';
import { getAssociationActionAsync } from '../association/association-async-actions';
import { getAssociationsPagedActionAsync } from '../association/association-async-actions';

// Get student follows
export const getStudentFollowsActionAsync = createAsyncThunk<any, { studentId: string; params?: any }, { state: RootState }>(
  FOLLOW__GET_FOLLOWS,
  async ({ studentId, params }, thunkApi) => {
    thunkApi.dispatch(setFollowLoadingAction(true));
    try {
      let response;
      if (params) {
        // Use paged request if params provided
        response = await getStudentFollowsPagedRequest(studentId, params);
        const formattedResponse = {
          associations: response.items || [],
          totalCount: response.totalCount || 0,
          page: response.pageNumber || 1,
          pageSize: response.pageSize || 10,
        };
        thunkApi.dispatch(setFollowingListAction(formattedResponse));
        return formattedResponse;
      } else {
        // Use non-paged request - this returns full association details
        response = await getStudentFollowsRequest(studentId);
        const associations = Array.isArray(response) ? response : [];
        const formattedResponse = {
          associations,
          totalCount: associations.length,
          page: 1,
          pageSize: associations.length,
        };
        thunkApi.dispatch(setFollowingListAction(formattedResponse));
        return formattedResponse;
      }
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setFollowLoadingAction(false));
    }
  },
);

export const getAssociationFollowersActionAsync = createAsyncThunk<any, { associationId: string; params?: any }, { state: RootState }>(
  FOLLOW__GET_FOLLOWERS,
  async ({ associationId }, thunkApi) => {
    thunkApi.dispatch(setFollowLoadingAction(true));
    try {
      const response = await getAssociationFollowersRequest(associationId);

      // Format for Redux store - the API request now returns full student details
      const formattedResponse = {
        followers: response,
        totalCount: response.length,
        page: 1,
        pageSize: response.length,
      };
      thunkApi.dispatch(setFollowersListAction(formattedResponse));
      return formattedResponse;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setFollowLoadingAction(false));
    }
  },
);

// Check follow status
export const checkFollowStatusActionAsync = createAsyncThunk<boolean, { studentId: string; associationId: string }, { state: RootState }>(
  FOLLOW__CHECK_STATUS,
  async ({ studentId, associationId }, thunkApi) => {
    try {
      const isFollowing = await checkFollowStatusRequest(studentId, associationId);
      thunkApi.dispatch(setFollowStatusAction({ associationId, isFollowing }));
      return isFollowing;
    } catch (err) {
      // Handle 404 errors silently - they just mean user is not following
      if (err instanceof ApiException && err.data?.status === 404) {
        thunkApi.dispatch(setFollowStatusAction({ associationId, isFollowing: false }));
        return false;
      }

      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    }
  },
);

// Follow association
export const followAssociationActionAsync = createAsyncThunk<any, { studentId: string; associationId: string; association?: any }, { state: RootState }>(
  FOLLOW__FOLLOW_ASSOCIATION,
  async ({ studentId, associationId, association }, thunkApi) => {
    thunkApi.dispatch(setFollowLoadingAction(true));
    try {
      const response = await followAssociationRequest(studentId, associationId);
      thunkApi.dispatch(addFollowAction(association || { id: associationId }));
      thunkApi.dispatch(setFollowStatusAction({ associationId, isFollowing: true }));
      alertService.successAlert('Successfully followed association!');

      // Refresh association data to update follower count
      await thunkApi.dispatch(getAssociationActionAsync(associationId));

      // Refresh association followers list
      await thunkApi.dispatch(getAssociationFollowersActionAsync({ associationId }));

      // Refresh associations list to update follower counts on main page
      await thunkApi.dispatch(getAssociationsPagedActionAsync({ page: 1, pageSize: 12 }));

      // Refresh student follows data
      await thunkApi.dispatch(
        getStudentFollowsActionAsync({
          studentId,
          params: { page: 1, pageSize: 100 },
        }),
      );

      return response;
    } catch (err) {
      // Handle 404 errors gracefully
      if (err instanceof ApiException && err.data?.status === 404) {
        alertService.errorAlert({ title: 'Not Found', message: 'Association or student not found.' });
        return;
      }

      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setFollowLoadingAction(false));
    }
  },
);

// Unfollow association
export const unfollowAssociationActionAsync = createAsyncThunk<void, { studentId: string; associationId: string }, { state: RootState }>(
  FOLLOW__UNFOLLOW_ASSOCIATION,
  async ({ studentId, associationId }, thunkApi) => {
    thunkApi.dispatch(setFollowLoadingAction(true));
    try {
      await unfollowAssociationRequest(studentId, associationId);
      thunkApi.dispatch(removeFollowAction(associationId));
      thunkApi.dispatch(setFollowStatusAction({ associationId, isFollowing: false }));
      alertService.successAlert('Successfully unfollowed association!');

      // Refresh association data to update follower count
      await thunkApi.dispatch(getAssociationActionAsync(associationId));

      // Refresh association followers list
      await thunkApi.dispatch(getAssociationFollowersActionAsync({ associationId }));

      // Refresh associations list to update follower counts on main page
      await thunkApi.dispatch(getAssociationsPagedActionAsync({ page: 1, pageSize: 12 }));

      // Refresh student follows data
      await thunkApi.dispatch(
        getStudentFollowsActionAsync({
          studentId,
          params: { page: 1, pageSize: 100 },
        }),
      );
    } catch (err) {
      // Handle 404 errors silently - they just mean the follow relationship doesn't exist
      if (err instanceof ApiException && err.data?.status === 404) {
        thunkApi.dispatch(removeFollowAction(associationId));
        thunkApi.dispatch(setFollowStatusAction({ associationId, isFollowing: false }));
        alertService.successAlert('Successfully unfollowed association!');

        // Still refresh data even if 404
        await thunkApi.dispatch(getAssociationActionAsync(associationId));
        await thunkApi.dispatch(getAssociationFollowersActionAsync({ associationId }));
        await thunkApi.dispatch(getAssociationsPagedActionAsync({ page: 1, pageSize: 12 }));
        await thunkApi.dispatch(
          getStudentFollowsActionAsync({
            studentId,
            params: { page: 1, pageSize: 100 },
          }),
        );
        return;
      }

      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setFollowLoadingAction(false));
    }
  },
);

// Remove follower (for associations to remove their followers)
export const removeFollowerActionAsync = createAsyncThunk<void, { associationId: string; studentId: string }, { state: RootState }>(
  'FOLLOW__REMOVE_FOLLOWER',
  async ({ associationId, studentId }, thunkApi) => {
    thunkApi.dispatch(setFollowLoadingAction(true));
    try {
      await unfollowAssociationRequest(studentId, associationId);
      alertService.successAlert('Follower removed successfully!');

      // Reload followers list after removal
      await thunkApi.dispatch(getAssociationFollowersActionAsync({ associationId }));
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setFollowLoadingAction(false));
    }
  },
);

// Get follow notifications
export const getFollowNotificationsActionAsync = createAsyncThunk<any, string, { state: RootState }>(FOLLOW__GET_NOTIFICATIONS, async (studentId, thunkApi) => {
  try {
    const response = await getFollowNotificationsRequest(studentId);
    thunkApi.dispatch(setFollowNotificationsAction(response));
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  }
});

// Mark notification as read
export const markNotificationReadActionAsync = createAsyncThunk<void, string, { state: RootState }>('FOLLOW__MARK_NOTIFICATION_READ', async notificationId => {
  try {
    await markFollowNotificationReadRequest(notificationId);
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  }
});
