import { RootState } from '..';
import IAssociationResponse from '@app/types/association/IAssociationResponse';

export const associationCurrentAssociationSelector = (state: RootState): IAssociationResponse | null => state.association.currentAssociation;
export const associationAssociationsListSelector = (state: RootState): any => state.association.associationsList;
export const associationFeaturedAssociationsSelector = (state: RootState): any => state.association.featuredAssociations;
export const associationIsLoadingSelector = (state: RootState): boolean => state.association.loading;
export const associationFullStateSelector = (state: RootState) => state.association;
