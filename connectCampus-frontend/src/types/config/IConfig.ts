import IApiConfig from './IApiConfig';

interface IConfig {
  environment: string;
  api: IApiConfig;
  // stripe: {
  //   publicKey: string;
  // };
}

export default IConfig;
