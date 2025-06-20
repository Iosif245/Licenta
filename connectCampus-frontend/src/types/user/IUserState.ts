import IUser from './IUser';

interface IUserState {
  currentUser: IUser | null;
  loading: boolean;
}

export default IUserState;
