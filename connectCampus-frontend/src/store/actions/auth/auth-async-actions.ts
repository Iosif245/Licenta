import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, navigate } from '../..';
import {
  AUTH__LOGIN,
  AUTH__REFRESH,
  AUTH__LOGOUT,
  AUTH__REGISTER_STUDENT,
  AUTH__REGISTER_ASSOCIATION,
  AUTH__FORGOT_PASSWORD,
  AUTH__RESET_PASSWORD,
  AUTH__VERIFY_TWO_FACTOR,
  AUTH__VERIFY_EMAIL,
  AUTH__GET_ME,
} from '@app/store/constants';
import {
  loginRequest,
  refreshRequest,
  logoutRequest,
  registerStudentRequest,
  registerAssociationRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  verifyTwoFactorRequest,
  verifyEmailRequest,
  getMeRequest,
} from '@app/api/requests/auth-requests';
import ILoginResponse from '@app/types/auth/ILoginResponse';
import { StudentRegistrationFormValues, AssociationRegistrationFormValues, LoginFormValues, ForgotPasswordFormValues, ResetPasswordFormValues } from '@app/schemas';
import ApiException from '@app/types/api/ApiException';
import { setAuthTokenAction, setAuthLoadingAction, resetAuthDataAction } from './auth-sync-actions';
import { fetchUserAndProfileActionAsync } from '../user/user-async-actions';
import alertService from '@app/services/alert';

export const loginActionAsync = createAsyncThunk<ILoginResponse, LoginFormValues, { state: RootState }>(AUTH__LOGIN, async (loginData, thunkApi) => {
  thunkApi.dispatch(setAuthLoadingAction(true));
  try {
    const response = await loginRequest(loginData);

    if (response.accessToken) {
      thunkApi.dispatch(setAuthTokenAction(response.accessToken));
      const userResult = await thunkApi.dispatch(fetchUserAndProfileActionAsync());

      const user = userResult.payload?.user;
      if (user?.role === 'Student') {
        navigate('/events');
      } else if (user?.role === 'Association') {
        navigate('/association/dashboard');
      } else {
        navigate('/');
      }
    }

    return response as ILoginResponse;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setAuthLoadingAction(false));
  }
});

export const refreshActionAsync = createAsyncThunk<ILoginResponse, void, { state: RootState }>(AUTH__REFRESH, async (_, thunkApi) => {
  thunkApi.dispatch(setAuthLoadingAction(true));
  try {
    const response = await refreshRequest();

    if (response.accessToken) {
      thunkApi.dispatch(setAuthTokenAction(response.accessToken));
    }

    return response as ILoginResponse;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setAuthLoadingAction(false));
  }
});

export const logoutActionAsync = createAsyncThunk<void, void, { state: RootState }>(AUTH__LOGOUT, async (_, thunkApi) => {
  thunkApi.dispatch(setAuthLoadingAction(true));
  try {
    await logoutRequest();
    thunkApi.dispatch(resetAuthDataAction());
    navigate('/login');
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    thunkApi.dispatch(resetAuthDataAction());
    navigate('/login');
    throw err;
  } finally {
    thunkApi.dispatch(setAuthLoadingAction(false));
  }
});

export const registerStudentActionAsync = createAsyncThunk<{ id: string }, StudentRegistrationFormValues, { state: RootState }>(
  AUTH__REGISTER_STUDENT,
  async (registrationData, thunkApi) => {
    thunkApi.dispatch(setAuthLoadingAction(true));
    try {
      const response = await registerStudentRequest(registrationData);
      alertService.successAlert('Student registration successful!');
      navigate('/login');
      return response;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setAuthLoadingAction(false));
    }
  },
);

export const registerAssociationActionAsync = createAsyncThunk<{ id: string }, AssociationRegistrationFormValues, { state: RootState }>(
  AUTH__REGISTER_ASSOCIATION,
  async (registrationData, thunkApi) => {
    thunkApi.dispatch(setAuthLoadingAction(true));
    try {
      const response = await registerAssociationRequest(registrationData);
      alertService.successAlert('Association registration successful!');
      navigate('/login');
      return response;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setAuthLoadingAction(false));
    }
  },
);

export const forgotPasswordActionAsync = createAsyncThunk<{ message: string }, ForgotPasswordFormValues, { state: RootState }>(
  AUTH__FORGOT_PASSWORD,
  async (forgotPasswordData, thunkApi) => {
    thunkApi.dispatch(setAuthLoadingAction(true));
    try {
      const response = await forgotPasswordRequest(forgotPasswordData);
      alertService.successAlert('Password reset email sent! Please check your inbox.');
      return response;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setAuthLoadingAction(false));
    }
  },
);

export const resetPasswordActionAsync = createAsyncThunk<{ message: string }, ResetPasswordFormValues, { state: RootState }>(
  AUTH__RESET_PASSWORD,
  async (resetPasswordData, thunkApi) => {
    thunkApi.dispatch(setAuthLoadingAction(true));
    try {
      const response = await resetPasswordRequest(resetPasswordData);
      alertService.successAlert('Password reset successful! You can now login with your new password.');
      navigate('/login');
      return response;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setAuthLoadingAction(false));
    }
  },
);

export const verifyTwoFactorActionAsync = createAsyncThunk<ILoginResponse, { code: string; userId: string }, { state: RootState }>(
  AUTH__VERIFY_TWO_FACTOR,
  async (twoFactorData, thunkApi) => {
    thunkApi.dispatch(setAuthLoadingAction(true));
    try {
      const response = await verifyTwoFactorRequest(twoFactorData);

      if (response.accessToken) {
        thunkApi.dispatch(setAuthTokenAction(response.accessToken));
        const userResult = await thunkApi.dispatch(fetchUserAndProfileActionAsync());

        const user = userResult.payload?.user;
        if (user?.role === 'Student') {
          navigate('/events');
        } else if (user?.role === 'Association') {
          navigate('/association/dashboard');
        } else {
          navigate('/');
        }
      }

      return response as ILoginResponse;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setAuthLoadingAction(false));
    }
  },
);

export const verifyEmailActionAsync = createAsyncThunk<{ message: string }, { token: string }, { state: RootState }>(AUTH__VERIFY_EMAIL, async (verifyEmailData, thunkApi) => {
  thunkApi.dispatch(setAuthLoadingAction(true));
  try {
    const response = await verifyEmailRequest(verifyEmailData);
    alertService.successAlert('Email verified successfully! You can now login.');
    navigate('/login');
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setAuthLoadingAction(false));
  }
});

export const getMeActionAsync = createAsyncThunk<any, void, { state: RootState }>(AUTH__GET_ME, async (_, thunkApi) => {
  thunkApi.dispatch(setAuthLoadingAction(true));
  try {
    const response = await getMeRequest();
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setAuthLoadingAction(false));
  }
});
