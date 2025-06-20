import IAssociationResponse from './IAssociationResponse';

interface IAssociationState {
  currentAssociation: IAssociationResponse | null;
  associationsList: any;
  featuredAssociations: any;
  loading: boolean;
}

export default IAssociationState;
