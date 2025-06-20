import { RootState } from '..';

export const profileCurrentProfileSelector = (state: RootState): any | null => state.profile.currentProfile;
export const profileIsLoadingSelector = (state: RootState): boolean => state.profile.loading;
export const profileFullStateSelector = (state: RootState) => state.profile;
export const profileStudentSelector = (state: RootState) => state.profile?.currentProfile?.studentProfile;
export const profileAssociationSelector = (state: RootState) => state.profile?.currentProfile?.associationProfile;
export const profileRoleSelector = (state: RootState): string | undefined => state.profile?.currentProfile?.role;
export const profileEmailSelector = (state: RootState): string | undefined => state.profile?.currentProfile?.email;
export const profileUserIdSelector = (state: RootState): string | undefined => state.profile?.currentProfile?.userId;
export const profileHasDataSelector = (state: RootState): boolean => !!state.profile?.currentProfile;
