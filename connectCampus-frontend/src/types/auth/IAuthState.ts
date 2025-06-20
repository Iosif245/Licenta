export enum AuthState {
  NotLoggedIn = 'NotLoggedIn',
  LoggedIn = 'LoggedIn',
  NotInitialized = 'NotInitialized',
}
interface IAuthState {
  token: string;
  state: AuthState;
  loading: boolean;
}

export default IAuthState;
