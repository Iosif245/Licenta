import { AxiosResponse } from 'axios';
import { authInstance, getApi } from '../index';
import IGetMeResponse from '@app/types/auth/IGetMeResponse';
import ILoginResponse from '@app/types/auth/ILoginResponse';
import { LoginFormValues, ForgotPasswordFormValues, ResetPasswordFormValues, StudentRegistrationFormValues, AssociationRegistrationFormValues } from '@app/schemas';

// Login
export const loginRequest = async (data: LoginFormValues): Promise<Partial<ILoginResponse>> => {
  const response: AxiosResponse<ILoginResponse> = await getApi().post('/api/auth/login', data, { withCredentials: true });
  return response.data;
};

// Student Registration
export const registerStudentRequest = async (data: StudentRegistrationFormValues): Promise<{ id: string }> => {
  // Create FormData for file upload
  const formData = new FormData();

  // Add all non-file fields
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('firstName', data.firstName);
  formData.append('lastName', data.lastName);
  formData.append('university', data.university);
  formData.append('faculty', data.faculty);
  formData.append('specialization', data.specialization);
  formData.append('studyYear', data.studyYear.toString());
  formData.append('educationLevel', data.educationLevel);

  // Add avatar file if provided
  if (data.avatar) {
    formData.append('avatar', data.avatar);
  }

  const response: AxiosResponse<{ id: string }> = await getApi().post('/api/auth/register/student', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Association Registration
export const registerAssociationRequest = async (data: AssociationRegistrationFormValues): Promise<{ id: string }> => {
  // Create FormData for file upload
  const formData = new FormData();

  // Add all non-file fields
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('description', data.description);
  formData.append('category', data.category);
  formData.append('foundedYear', data.foundedYear.toString());

  // Optional fields
  if (data.website) formData.append('website', data.website);
  if (data.location) formData.append('location', data.location);
  if (data.phone) formData.append('phone', data.phone);
  if (data.address) formData.append('address', data.address);
  if (data.facebook) formData.append('facebook', data.facebook);
  if (data.twitter) formData.append('twitter', data.twitter);
  if (data.instagram) formData.append('instagram', data.instagram);
  if (data.linkedIn) formData.append('linkedIn', data.linkedIn);

  // Add logo file if provided
  if (data.logo) {
    formData.append('logo', data.logo);
  }

  // Add cover image if provided
  if (data.coverImage) {
    formData.append('coverImage', data.coverImage);
  }

  const response: AxiosResponse<{ id: string }> = await getApi().post('/api/auth/register/association', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Forgot Password
export const forgotPasswordRequest = async (data: ForgotPasswordFormValues): Promise<{ message: string }> => {
  const response: AxiosResponse<{ message: string }> = await getApi().post('/api/auth/forgot-password', data);
  return response.data;
};

// Reset Password
export const resetPasswordRequest = async (data: ResetPasswordFormValues): Promise<{ message: string }> => {
  const response: AxiosResponse<{ message: string }> = await getApi().post('/api/auth/reset-password', data);
  return response.data;
};

// Refresh Token
export const refreshRequest = async (): Promise<Partial<ILoginResponse>> => {
  const response: AxiosResponse<ILoginResponse> = await authInstance().post('/api/auth/refresh', null, { withCredentials: true });
  return response.data;
};

// Get Current User
export const getMeRequest = async (): Promise<Partial<IGetMeResponse>> => {
  const response: AxiosResponse<IGetMeResponse> = await getApi().get('/api/users/me');
  return response.data;
};

// Logout
export const logoutRequest = async (): Promise<void> => {
  await getApi().post('/api/auth/logout', null, { withCredentials: true });
};

// Two-Factor Authentication (if implemented)
export const verifyTwoFactorRequest = async (data: { code: string; userId: string }): Promise<Partial<ILoginResponse>> => {
  const response: AxiosResponse<ILoginResponse> = await getApi().post('/api/auth/verify-2fa', data, { withCredentials: true });
  return response.data;
};

// Email Verification (if implemented)
export const verifyEmailRequest = async (data: { token: string }): Promise<{ message: string }> => {
  const response: AxiosResponse<{ message: string }> = await getApi().post('/api/auth/verify-email', data);
  return response.data;
};
