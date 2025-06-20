import { createAsyncThunk } from '@reduxjs/toolkit';
import IUserPreferences, { IUpdateUserPreferences } from '@app/types/user-preferences/IUserPreferences';
import { getUserPreferencesRequest, updateUserPreferencesRequest } from '@app/api/requests/user-preferences-requests';
import handleApiError from '@app/lib/handlerApiError';
import { USER_PREFERENCES_ACTION_TYPES } from '@app/store/constants';

// Fetch user preferences
export const fetchUserPreferencesActionAsync = createAsyncThunk<IUserPreferences, string, { rejectValue: string }>(
  USER_PREFERENCES_ACTION_TYPES.FETCH_USER_PREFERENCES,
  async (userId: string, { rejectWithValue }) => {
    try {
      const preferences = await getUserPreferencesRequest(userId);
      return preferences;
    } catch (error: any) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError.error);
    }
  },
);

// Update user preferences
export const updateUserPreferencesActionAsync = createAsyncThunk<IUserPreferences, { userId: string; preferences: IUpdateUserPreferences }, { rejectValue: string }>(
  USER_PREFERENCES_ACTION_TYPES.UPDATE_USER_PREFERENCES,
  async ({ userId, preferences }, { rejectWithValue }) => {
    try {
      await updateUserPreferencesRequest(userId, preferences);
      // Return updated preferences (refetch to get current state)
      const updatedPreferences = await getUserPreferencesRequest(userId);
      return updatedPreferences;
    } catch (error: any) {
      const apiError = handleApiError(error);
      return rejectWithValue(apiError.error);
    }
  },
);
