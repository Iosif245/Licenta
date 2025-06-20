import IAuthState, { AuthState } from '@app/types/auth/IAuthState';
import { createReducer } from '@reduxjs/toolkit';

import { setAuthStateAction, setAuthTokenAction, setAuthLoadingAction, resetAuthDataAction } from '../actions/auth/auth-sync-actions';

const initialState: IAuthState = {
  token: '',
  state: AuthState.NotInitialized,
  loading: false,
};

const authReducer = createReducer(initialState, builder =>
  builder
    .addCase(setAuthStateAction, (state, action) => ({ ...state, state: action.payload }))
    .addCase(setAuthTokenAction, (state, action) => {
      // Save token to localStorage for persistence
      if (action.payload) {
        localStorage.setItem('authToken', action.payload);
      } else {
        localStorage.removeItem('authToken');
      }

      return {
        ...state,
        token: action.payload,
        state: action.payload ? AuthState.LoggedIn : AuthState.NotLoggedIn,
      };
    })
    .addCase(setAuthLoadingAction, (state, action) => ({ ...state, loading: action.payload }))
    .addCase(resetAuthDataAction, () => {
      // Clear localStorage when resetting auth data
      localStorage.removeItem('authToken');
      return { ...initialState, state: AuthState.NotLoggedIn };
    }),
);

export default authReducer;
