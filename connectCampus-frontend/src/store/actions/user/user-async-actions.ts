import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { USER__FETCH } from '@app/store/constants';
import ApiException from '@app/types/api/ApiException';
import { getMeRequest } from '@app/api/requests/auth-requests';
import { fetchProfileRequest } from '@app/api/requests/profile-requests';
import { setUserAction, setUserLoadingAction } from './user-sync-actions';
import { setProfileAction } from '../profile/profile-sync-actions';

// Fetch user data
export const fetchUserActionAsync = createAsyncThunk<any, void, { state: RootState }>(USER__FETCH, async (_, thunkApi) => {
  thunkApi.dispatch(setUserLoadingAction(true));
  try {
    const response = await getMeRequest();
    thunkApi.dispatch(setUserAction(response as any));
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setUserLoadingAction(false));
  }
});

// Fetch user and profile combined action
export const fetchUserAndProfileActionAsync = createAsyncThunk<any, void, { state: RootState }>('user/fetchUserAndProfile', async (_, thunkApi) => {
  thunkApi.dispatch(setUserLoadingAction(true));
  try {
    // Fetch both user and profile data in parallel
    const [userResponse, profileResponse] = await Promise.all([getMeRequest(), fetchProfileRequest()]);

    // Update both stores
    thunkApi.dispatch(setUserAction(userResponse as any));
    thunkApi.dispatch(setProfileAction(profileResponse as any));

    return { user: userResponse, profile: profileResponse };
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setUserLoadingAction(false));
  }
});
