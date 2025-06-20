import { AuthState } from '@app/types/auth/IAuthState';
import { RootState } from '..';

export const authTokenSelector = (state: RootState): string => state.auth.token;
export const authStateSelector = (state: RootState): AuthState => state.auth.state;
export const authIsAuthenticatedSelector = (state: RootState): boolean => state.auth.state === AuthState.LoggedIn;
export const authIsLoadingSelector = (state: RootState): boolean => state.auth.loading;
export const authIsNotInitializedSelector = (state: RootState): boolean => state.auth.state === AuthState.NotInitialized;
export const authIsNotLoggedInSelector = (state: RootState): boolean => state.auth.state === AuthState.NotLoggedIn;
export const authHasTokenSelector = (state: RootState): boolean => !!state.auth.token;
export const authFullStateSelector = (state: RootState) => state.auth;
