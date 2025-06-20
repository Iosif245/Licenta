import { AxiosResponse } from 'axios';
import { getApi } from '../index';
import IUserPreferences, { IUpdateUserPreferences } from '@app/types/user-preferences/IUserPreferences';

// API Request Functions

/**
 * Get user preferences by user ID
 */
export const getUserPreferencesRequest = async (userId: string): Promise<IUserPreferences> => {
  const response: AxiosResponse<IUserPreferences> = await getApi().get(`/api/users/${userId}/preferences`);
  return response.data;
};

/**
 * Update user preferences
 */
export const updateUserPreferencesRequest = async (userId: string, preferences: IUpdateUserPreferences): Promise<void> => {
  await getApi().put(`/api/users/${userId}/preferences`, preferences);
};
