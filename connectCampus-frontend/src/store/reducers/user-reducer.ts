import IUserState from '@app/types/user/IUserState';
import { createReducer } from '@reduxjs/toolkit';
import { setUserAction, setUserLoadingAction, setUserRoleAction, resetUserAction } from '../actions/user/user-sync-actions';

const initialState: IUserState = {
  currentUser: null,
  loading: false,
};

const userReducer = createReducer(initialState, builder =>
  builder
    .addCase(setUserAction, (state, action) => ({ ...state, currentUser: action.payload }))
    .addCase(setUserLoadingAction, (state, action) => ({ ...state, loading: action.payload }))
    .addCase(setUserRoleAction, (state, action) => ({
      ...state,
      currentUser: state.currentUser ? { ...state.currentUser, role: action.payload } : null,
    }))
    .addCase(resetUserAction, () => initialState),
);

export default userReducer;
