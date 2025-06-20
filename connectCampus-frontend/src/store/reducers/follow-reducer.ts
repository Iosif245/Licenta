import { createReducer } from '@reduxjs/toolkit';
import {
  setFollowStatsAction,
  setFollowersListAction,
  setFollowingListAction,
  setFollowLoadingAction,
  resetFollowAction,
  addFollowAction,
  removeFollowAction,
  setFollowStatusAction,
  setFollowNotificationsAction,
} from '../actions/follow/follow-sync-actions';

interface IFollowState {
  followStats: any;
  followersList: any;
  followingList: any;
  loading: boolean;
  followStatuses: Record<string, boolean>;
  notifications: any[];
}

const initialState: IFollowState = {
  followStats: {
    followingCount: 0,
    followersCount: 0,
  },
  followersList: {
    followers: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
  },
  followingList: {
    associations: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
  },
  loading: false,
  followStatuses: {},
  notifications: [],
};

const followReducer = createReducer(initialState, builder =>
  builder
    .addCase(setFollowStatsAction, (state, action) => ({
      ...state,
      followStats: action.payload,
    }))
    .addCase(setFollowersListAction, (state, action) => ({
      ...state,
      followersList: action.payload,
    }))
    .addCase(setFollowingListAction, (state, action) => ({
      ...state,
      followingList: action.payload,
    }))
    .addCase(setFollowLoadingAction, (state, action) => ({
      ...state,
      loading: action.payload,
    }))
    .addCase(addFollowAction, (state, action) => ({
      ...state,
      followingList: {
        ...state.followingList,
        associations: [...state.followingList.associations, action.payload],
        totalCount: state.followingList.totalCount + 1,
      },
      followStats: {
        ...state.followStats,
        followingCount: state.followStats.followingCount + 1,
      },
    }))
    .addCase(removeFollowAction, (state, action) => ({
      ...state,
      followingList: {
        ...state.followingList,
        associations: state.followingList.associations.filter((association: any) => association.id !== action.payload),
        totalCount: state.followingList.totalCount - 1,
      },
      followStats: {
        ...state.followStats,
        followingCount: state.followStats.followingCount - 1,
      },
    }))
    .addCase(setFollowStatusAction, (state, action) => ({
      ...state,
      followStatuses: {
        ...state.followStatuses,
        [action.payload.associationId]: action.payload.isFollowing,
      },
    }))
    .addCase(setFollowNotificationsAction, (state, action) => ({
      ...state,
      notifications: action.payload,
    }))
    .addCase(resetFollowAction, () => initialState),
);

export default followReducer;
