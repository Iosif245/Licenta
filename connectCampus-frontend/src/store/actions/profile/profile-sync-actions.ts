import { createAction } from '@reduxjs/toolkit';
import { PROFILE__SET, PROFILE__SET_LOADING, PROFILE__RESET } from '../../constants';

export const setProfileAction = createAction<any>(PROFILE__SET);
export const setProfileLoadingAction = createAction<boolean>(PROFILE__SET_LOADING);
export const resetProfileAction = createAction<void>(PROFILE__RESET);
