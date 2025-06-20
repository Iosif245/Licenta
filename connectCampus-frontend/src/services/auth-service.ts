import { store } from '@app/store';
import { refreshActionAsync } from '@app/store/actions/auth/auth-async-actions';

const authService = async (): Promise<void> => {
  await store.dispatch(refreshActionAsync());
};

export default authService;
