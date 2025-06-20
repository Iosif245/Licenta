import { createAction } from '@reduxjs/toolkit';
import { USER__SET, USER__SET_LOADING, USER__SET_ROLE, USER__RESET } from '../../constants';
import IUser from '@app/types/user/IUser';
import { Role } from '@app/types/user/Role';

export const setUserAction = createAction<IUser>(USER__SET);
export const setUserLoadingAction = createAction<boolean>(USER__SET_LOADING);
export const setUserRoleAction = createAction<Role>(USER__SET_ROLE);
export const resetUserAction = createAction<void>(USER__RESET);
