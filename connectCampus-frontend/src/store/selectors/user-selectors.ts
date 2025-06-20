import IUser from '@app/types/user/IUser';
import { RootState } from '..';
import { Role } from '@app/types/user/Role';

export const userIsLoadingSelector = (state: RootState): boolean => state.user.loading;
export const userSelector = (state: RootState): IUser | null => state.user?.currentUser || null;
export const userRoleSelector = (state: RootState): Role | undefined => state.user?.currentUser?.role;
export const userIdSelector = (state: RootState): string | undefined => state.user?.currentUser?.id;
export const userEmailSelector = (state: RootState): string | undefined => state.user?.currentUser?.email;
export const userHasDataSelector = (state: RootState): boolean => !!state.user?.currentUser;
export const userFullStateSelector = (state: RootState) => state.user;
