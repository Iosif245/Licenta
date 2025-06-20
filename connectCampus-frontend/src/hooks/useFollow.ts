import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@app/store';
import {
  followAssociationActionAsync,
  unfollowAssociationActionAsync,
  checkFollowStatusActionAsync,
  getAssociationFollowersActionAsync,
  getStudentFollowsActionAsync,
  // Removed stats actions - manual calculation only
} from '@app/store/actions/follow/follow-async-actions';
import {
  followStatusSelector,
  followIsLoadingSelector,
  followersSelector,
  followingAssociationsSelector,
  followStatsSelector,
  followersTotalCountSelector,
  followingTotalCountSelector,
} from '@app/store/selectors/follow-selectors';
import { userSelector } from '@app/store/selectors/user-selectors';
import { currentStudentSelector } from '@app/store/selectors/student-selectors';

interface UseFollowOptions {
  associationId?: string;
  studentId?: string;
  autoCheck?: boolean;
  // Removed autoLoadStats - manual calculation only
}

interface UseFollowReturn {
  // Status
  isFollowing: boolean;
  loading: boolean;

  // Data
  followers: any[];
  following: any[];
  stats: any;
  totalFollowers: number;
  totalFollowing: number;

  // Date-based statistics
  dateStats: {
    newThisMonth: number;
    newThisYear: number;
    studentsCount: number;
    totalFollowers: number;
  };

  // Actions
  follow: (association?: any) => Promise<void>;
  unfollow: () => Promise<void>;
  checkStatus: () => Promise<void>;
  loadFollowers: (params?: any) => Promise<void>;
  loadFollowing: (params?: any) => Promise<void>;
  loadStats: () => Promise<void>;

  // User info
  user: any;
}

export const useFollow = (options: UseFollowOptions = {}): UseFollowReturn => {
  const { associationId, studentId, autoCheck = true } = options;

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(userSelector);
  const currentStudent = useSelector(currentStudentSelector);
  const loading = useSelector(followIsLoadingSelector);
  const isFollowing = useSelector(followStatusSelector(associationId || ''));
  const followers = useSelector(followersSelector);
  const following = useSelector(followingAssociationsSelector);
  const stats = useSelector(followStatsSelector);
  const totalFollowers = useSelector(followersTotalCountSelector);
  const totalFollowing = useSelector(followingTotalCountSelector);

  // Calculate date-based statistics from followers data
  const dateStats = useMemo(() => {
    const currentDate = new Date();
    const thisMonth = currentDate.getMonth();
    const thisYear = currentDate.getFullYear();

    // All followers are students (associations can't follow associations)
    const allFollowers = followers || [];

    // New followers this month
    const newThisMonth = allFollowers.filter((follower: any) => {
      if (!follower.createdAt) return false;
      const followDate = new Date(follower.createdAt);
      return followDate.getMonth() === thisMonth && followDate.getFullYear() === thisYear;
    }).length;

    // New followers this year
    const newThisYear = allFollowers.filter((follower: any) => {
      if (!follower.createdAt) return false;
      const followDate = new Date(follower.createdAt);
      return followDate.getFullYear() === thisYear;
    }).length;

    // Total students (all followers are students)
    const studentsCount = allFollowers.length;

    return {
      newThisMonth,
      newThisYear,
      studentsCount,
      totalFollowers: studentsCount,
    };
  }, [followers]);

  // Use provided studentId or get from current student profile (NOT user.id)
  const currentStudentId = studentId || currentStudent?.id;

  // Auto-check follow status
  useEffect(() => {
    if (autoCheck && currentStudentId && associationId) {
      dispatch(
        checkFollowStatusActionAsync({
          studentId: currentStudentId,
          associationId,
        }),
      );
    }
  }, [dispatch, autoCheck, currentStudentId, associationId]);

  // Auto-load stats removed - manual calculation only

  // Actions
  const follow = useCallback(
    async (association?: any) => {
      if (!currentStudentId || !associationId) return;

      try {
        await dispatch(
          followAssociationActionAsync({
            studentId: currentStudentId,
            associationId,
            association,
          }),
        );

        // Refresh follower count after following
        await dispatch(
          getAssociationFollowersActionAsync({
            associationId,
            params: { page: 1, pageSize: 50 },
          }),
        );
      } catch (error: any) {
        // Handle specific errors gracefully
        if (error?.response?.status === 404) {
          console.log('Association or student not found');
          return;
        }
        throw error;
      }
    },
    [dispatch, currentStudentId, associationId],
  );

  const unfollow = useCallback(async () => {
    if (!currentStudentId || !associationId) return;

    try {
      await dispatch(
        unfollowAssociationActionAsync({
          studentId: currentStudentId,
          associationId,
        }),
      );

      // Refresh follower count after unfollowing
      await dispatch(
        getAssociationFollowersActionAsync({
          associationId,
          params: { page: 1, pageSize: 50 },
        }),
      );
    } catch (error: any) {
      // Handle 404 errors silently - they just mean the follow relationship doesn't exist
      if (error?.response?.status === 404) {
        console.log('Follow relationship already does not exist');
        return;
      }
      throw error;
    }
  }, [dispatch, currentStudentId, associationId]);

  const checkStatus = useCallback(async () => {
    if (!currentStudentId || !associationId) return;

    await dispatch(
      checkFollowStatusActionAsync({
        studentId: currentStudentId,
        associationId,
      }),
    );
  }, [dispatch, currentStudentId, associationId]);

  const loadFollowers = useCallback(
    async (params?: any) => {
      if (!associationId) return;

      await dispatch(
        getAssociationFollowersActionAsync({
          associationId,
          params,
        }),
      );
    },
    [dispatch, associationId],
  );

  const loadFollowing = useCallback(
    async (params?: any) => {
      if (!currentStudentId) return;

      await dispatch(
        getStudentFollowsActionAsync({
          studentId: currentStudentId,
          params,
        }),
      );
    },
    [dispatch, currentStudentId],
  );

  const loadStats = useCallback(async () => {
    // Stats loading removed - manual calculation only
    console.warn('loadStats is deprecated - use manual calculation instead');
  }, []);

  return {
    // Status
    isFollowing,
    loading,

    // Data
    followers,
    following,
    stats,
    totalFollowers,
    totalFollowing,

    // Date-based statistics
    dateStats,

    // Actions
    follow,
    unfollow,
    checkStatus,
    loadFollowers,
    loadFollowing,
    loadStats,

    // User info
    user,
  };
};

export default useFollow;
