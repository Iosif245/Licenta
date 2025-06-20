import axios, { Axios } from 'axios';
import isEmpty from 'lodash/isEmpty';
import { refreshActionAsync } from '@app/store/actions/auth/auth-async-actions';
import { EventType } from '@app/emitters/EventType';
import Config from '../config';
import eventEmitter from '@app/emitters/eventEmitters';
import { AuthState } from '@app/types/auth/IAuthState';
import { store } from '@app/store';
import handleApiError from '@app/lib/handlerApiError';
import { authTokenSelector, authStateSelector } from '@app/store/selectors/auth-selectors';

let instance: Axios | null = null;

export const authInstance = (): Axios => {
  return axios.create({
    baseURL: Config.api.apiUrl,
  });
};

export const initApi = () => {
  instance = axios.create({
    baseURL: Config.api.apiUrl,
  });

  instance.interceptors.request.use(config => {
    const newConfig = { ...config };
    if (authTokenSelector(store.getState())) {
      const token = authTokenSelector(store.getState());
      newConfig.headers.Authorization = `Bearer ${token}`;
    }
    return newConfig;
  });

  instance.interceptors.response.use(
    res => {
      return res;
    },
    async error => {
      if (error.response && error.response.status === 401) {
        await store.dispatch(refreshActionAsync());
        const authState = authStateSelector(store.getState());

        if (authState == AuthState.LoggedIn) {
          try {
            const accessToken = authTokenSelector(store.getState());

            const response = await axios({
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              method: error?.config?.method,
              url: (error?.config?.baseURL as string) + (error?.config?.url as string),
              data: error?.config?.data,
            });
            return Promise.resolve(response);
          } catch (err) {
            throw handleApiError(error);
          }
        } else {
          eventEmitter.emit(EventType.AUTH__REQUIRED);
          throw error;
        }
      }
      throw handleApiError(error);
    },
  );
};

export const getApi = (): Axios => {
  if (isEmpty(instance)) {
    initApi();
  }

  if (instance === null) {
    throw new Error('API instance has not been initialized.');
  }
  return instance;
};
