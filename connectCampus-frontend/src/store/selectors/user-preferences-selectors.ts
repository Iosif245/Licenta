import { RootState } from '@app/store';
import IUserPreferences from '@app/types/user-preferences/IUserPreferences';

export const userPreferencesSelector = (state: RootState): IUserPreferences | null => state.userPreferences.data;

export const userPreferencesLoadingSelector = (state: RootState): boolean => state.userPreferences.isLoading;

export const userPreferencesErrorSelector = (state: RootState): string | null => state.userPreferences.error;
