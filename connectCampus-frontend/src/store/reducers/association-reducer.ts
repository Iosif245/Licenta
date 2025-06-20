import IAssociationState from '@app/types/association/IAssociationState';
import { createReducer } from '@reduxjs/toolkit';
import {
  setAssociationAction,
  setAssociationsListAction,
  setFeaturedAssociationsAction,
  setAssociationLoadingAction,
  resetAssociationAction,
  updateAssociationInListAction,
  removeAssociationFromListAction,
} from '../actions/association/association-sync-actions';

const initialState: IAssociationState = {
  currentAssociation: null,
  associationsList: {
    associations: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
  },
  featuredAssociations: {
    associations: [],
    totalCount: 0,
  },
  loading: false,
};

const associationReducer = createReducer(initialState, builder =>
  builder
    .addCase(setAssociationAction, (state, action) => ({ ...state, currentAssociation: action.payload }))
    .addCase(setAssociationsListAction, (state, action) => ({ ...state, associationsList: action.payload }))
    .addCase(setFeaturedAssociationsAction, (state, action) => ({ ...state, featuredAssociations: action.payload }))
    .addCase(setAssociationLoadingAction, (state, action) => ({ ...state, loading: action.payload }))
    .addCase(updateAssociationInListAction, (state, action) => ({
      ...state,
      associationsList: {
        ...state.associationsList,
        associations: state.associationsList.associations.map((association: any) => (association.id === action.payload.id ? action.payload : association)),
      },
    }))
    .addCase(removeAssociationFromListAction, (state, action) => ({
      ...state,
      associationsList: {
        ...state.associationsList,
        associations: state.associationsList.associations.filter((association: any) => association.id !== action.payload),
        totalCount: state.associationsList.totalCount - 1,
      },
    }))
    .addCase(resetAssociationAction, () => initialState),
);

export default associationReducer;
