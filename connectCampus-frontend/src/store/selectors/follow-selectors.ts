import { RootState } from '..';

export const followStatsSelector = (state: RootState) => state.follow?.followStats;
export const followingCountSelector = (state: RootState): number => state.follow?.followStats?.followingCount || 0;
export const followersCountSelector = (state: RootState): number => state.follow?.followStats?.followersCount || 0;
export const followersListSelector = (state: RootState) => state.follow?.followersList;
export const followersSelector = (state: RootState) => state.follow?.followersList?.followers || [];
export const followersTotalCountSelector = (state: RootState): number => state.follow?.followersList?.totalCount || 0;
export const followingListSelector = (state: RootState) => state.follow?.followingList;
export const followingAssociationsSelector = (state: RootState) => state.follow?.followingList?.associations || [];
export const followingTotalCountSelector = (state: RootState): number => state.follow?.followingList?.totalCount || 0;
export const followIsLoadingSelector = (state: RootState): boolean => state.follow?.loading || false;
export const followHasFollowersSelector = (state: RootState): boolean => (state.follow?.followersList?.followers?.length || 0) > 0;
export const followHasFollowingSelector = (state: RootState): boolean => (state.follow?.followingList?.associations?.length || 0) > 0;
export const followFullStateSelector = (state: RootState) => state.follow;
export const followStatusSelector =
  (associationId: string) =>
  (state: RootState): boolean =>
    state.follow?.followStatuses?.[associationId] || false;
export const followNotificationsSelector = (state: RootState) => state.follow?.notifications || [];
export const followUnreadNotificationsSelector = (state: RootState) => (state.follow?.notifications || []).filter((notification: any) => !notification.isRead);
export const followUnreadNotificationsCountSelector = (state: RootState): number => (state.follow?.notifications || []).filter((notification: any) => !notification.isRead).length;
