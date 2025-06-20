import IProfileState from '@app/types/profile/IProfileState';
import { createReducer } from '@reduxjs/toolkit';
import { setProfileAction, setProfileLoadingAction, resetProfileAction } from '../actions/profile/profile-sync-actions';

const initialState: IProfileState = {
  currentProfile: null,
  loading: false,
};

const profileReducer = createReducer(initialState, builder =>
  builder
    .addCase(setProfileAction, (state, action) => ({ ...state, currentProfile: action.payload }))
    .addCase(setProfileLoadingAction, (state, action) => ({ ...state, loading: action.payload }))
    .addCase(resetProfileAction, () => initialState),
);

export default profileReducer;
