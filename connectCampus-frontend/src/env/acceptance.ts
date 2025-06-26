import IConfig from '@app/types/config/IConfig';

const AcceptanceEnvironment: IConfig = {
  environment: 'acceptance',
  api: {
    apiUrl: 'http://localhost:5178',
  },
};

export default AcceptanceEnvironment;
