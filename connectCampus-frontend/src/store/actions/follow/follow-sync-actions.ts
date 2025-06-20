import { createAction } from '@reduxjs/toolkit';

export const setFollowStatsAction = createAction<any>('follow/setFollowStats');
export const setFollowersListAction = createAction<any>('follow/setFollowersList');
export const setFollowingListAction = createAction<any>('follow/setFollowingList');
export const setFollowLoadingAction = createAction<boolean>('follow/setLoading');
export const resetFollowAction = createAction('follow/reset');
export const addFollowAction = createAction<any>('follow/addFollow');
export const removeFollowAction = createAction<string>('follow/removeFollow');
export const setFollowStatusAction = createAction<{ associationId: string; isFollowing: boolean }>('follow/setFollowStatus');
export const setFollowNotificationsAction = createAction<any[]>('follow/setFollowNotifications');
