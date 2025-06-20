import { createAction } from '@reduxjs/toolkit';
import { ASSOCIATION__SET, ASSOCIATION__SET_LIST, ASSOCIATION__SET_FEATURED, ASSOCIATION__SET_LOADING, ASSOCIATION__RESET } from '../../constants';
import IAssociationResponse from '@app/types/association/IAssociationResponse';

export const setAssociationAction = createAction<IAssociationResponse>(ASSOCIATION__SET);
export const setAssociationsListAction = createAction<any>(ASSOCIATION__SET_LIST);
export const setFeaturedAssociationsAction = createAction<any>(ASSOCIATION__SET_FEATURED);
export const setAssociationLoadingAction = createAction<boolean>(ASSOCIATION__SET_LOADING);
export const resetAssociationAction = createAction<void>(ASSOCIATION__RESET);
export const updateAssociationInListAction = createAction<IAssociationResponse>('association/updateInList');
export const removeAssociationFromListAction = createAction<string>('association/removeFromList');
