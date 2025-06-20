import React, { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { ThemeProvider } from '@app/components/ui/theme-provider';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { fetchUserAndProfileActionAsync } from '@app/store/actions/user/user-async-actions';
import { authStateSelector } from '@app/store/selectors/auth-selectors';
import { AuthState } from '@app/types/auth/IAuthState';
import { setAuthStateAction, setAuthTokenAction } from '@app/store/actions/auth/auth-sync-actions';
import { Toaster } from 'sonner';

const App = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(authStateSelector);

  useEffect(() => {
    // Initialize auth state based on token presence
    const token = localStorage.getItem('authToken');

    console.log('App Init - Token exists:', !!token);
    console.log('App Init - Current auth state:', authState);

    if (token) {
      // Token exists, set it in Redux state and fetch user data
      dispatch(setAuthTokenAction(token));
      dispatch(fetchUserAndProfileActionAsync())
        .then(() => {
          console.log('User fetch completed');
        })
        .catch(error => {
          console.error('User fetch failed:', error);
          // If fetch fails, clear token and set to not logged in
          localStorage.removeItem('authToken');
          dispatch(setAuthStateAction(AuthState.NotLoggedIn));
        });
    } else {
      // No token, set to not logged in
      dispatch(setAuthStateAction(AuthState.NotLoggedIn));
    }
  }, [dispatch]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AppRouter />
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
