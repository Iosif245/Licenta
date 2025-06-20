import { createAction } from '@reduxjs/toolkit';
import { AUTH__SET_TOKEN, AUTH__SET_STATE, AUTH__SET_LOADING, AUTH__RESET_DATA } from '../../constants';
import { AuthState } from '@app/types/auth/IAuthState';

export const setAuthTokenAction = createAction<string>(AUTH__SET_TOKEN);
export const setAuthStateAction = createAction<AuthState>(AUTH__SET_STATE);
export const setAuthLoadingAction = createAction<boolean>(AUTH__SET_LOADING);
export const resetAuthDataAction = createAction<void>(AUTH__RESET_DATA);
