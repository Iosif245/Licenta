import { useEffect } from 'react';
import { EventType } from '@app/emitters/EventType';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import eventEmitter from '@app/emitters/eventEmitters';
import { useAppSelector } from '@app/store/hooks';
import { ROUTE__LOGIN } from './routes';
import { AuthState } from '@app/types/auth/IAuthState';
import React from 'react';
import { authIsLoadingSelector, authStateSelector } from '@app/store/selectors/auth-selectors';
import { Role } from '@app/types/user/Role';
import alertService from '@app/services/alert';
import { userRoleSelector } from '@app/store/selectors/user-selectors';

const ProtectedRoutes = ({ allowedRoles }: { allowedRoles?: Role[] }) => {
  const authState = useAppSelector(authStateSelector);
  const authIsLoading = useAppSelector(authIsLoadingSelector);
  const role = useAppSelector(userRoleSelector);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (authIsLoading) {
      return;
    }

    if (authState === AuthState.NotLoggedIn) {
      navigate(ROUTE__LOGIN, { state: { from: location }, replace: true });
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      navigate(ROUTE__LOGIN, { state: { from: location }, replace: true });
    }
  }, [location, authState, authIsLoading, role]);

  useEffect(() => {
    eventEmitter.subscribe(EventType.AUTH__REQUIRED, () => {
      alertService.errorAlert({ title: 'Authentication Required', message: 'You need to log in to access this page.' });
    });

    return () => {
      eventEmitter.unsubscribe(EventType.AUTH__REQUIRED);
    };
  }, [navigate]);
  return <Outlet />;
};

export default ProtectedRoutes;
