import { createReducer } from '@reduxjs/toolkit';
import IUserPreferences from '@app/types/user-preferences/IUserPreferences';
import { fetchUserPreferencesActionAsync, updateUserPreferencesActionAsync } from '@app/store/actions/user-preferences/user-preferences-async-actions';

export interface IUserPreferencesState {
  data: IUserPreferences | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IUserPreferencesState = {
  data: null,
  isLoading: false,
  error: null,
};

const userPreferencesReducer = createReducer(initialState, builder => {
  builder
    // Fetch user preferences
    .addCase(fetchUserPreferencesActionAsync.pending, state => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchUserPreferencesActionAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.data = action.payload;
    })
    .addCase(fetchUserPreferencesActionAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch user preferences';
    })

    // Update user preferences
    .addCase(updateUserPreferencesActionAsync.pending, state => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(updateUserPreferencesActionAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.data = action.payload;
    })
    .addCase(updateUserPreferencesActionAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to update user preferences';
    });
});

export default userPreferencesReducer;
