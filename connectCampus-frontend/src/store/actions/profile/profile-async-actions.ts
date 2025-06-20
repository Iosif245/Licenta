import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { PROFILE__FETCH, PROFILE__UPDATE } from '@app/store/constants';
import ApiException from '@app/types/api/ApiException';
import { fetchProfileRequest, updateStudentProfileRequest } from '@app/api/requests/profile-requests';
import { setProfileAction, setProfileLoadingAction } from './profile-sync-actions';
import alertService from '@app/services/alert';

// Fetch profile data
export const fetchProfileActionAsync = createAsyncThunk<any, void, { state: RootState }>(PROFILE__FETCH, async (_, thunkApi) => {
  thunkApi.dispatch(setProfileLoadingAction(true));
  try {
    const response = await fetchProfileRequest();
    thunkApi.dispatch(setProfileAction(response as any));
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setProfileLoadingAction(false));
  }
});

// Update profile data
export const updateProfileActionAsync = createAsyncThunk<any, { id: string; data: any }, { state: RootState }>(PROFILE__UPDATE, async ({ id, data }, thunkApi) => {
  thunkApi.dispatch(setProfileLoadingAction(true));
  try {
    await updateStudentProfileRequest(id, data);
    // Refetch profile to get updated data
    const updatedProfile = await fetchProfileRequest();
    thunkApi.dispatch(setProfileAction(updatedProfile as any));
    alertService.successAlert('Profile updated successfully!');
    return updatedProfile;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setProfileLoadingAction(false));
  }
});
