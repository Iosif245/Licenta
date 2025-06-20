import authService from './auth-service';

const loadServices = async (): Promise<void> => {
  await authService();
};

export default loadServices;
