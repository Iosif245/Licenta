import IConfig from '@app/types/config/IConfig';
import Environment from '@app/config/environment';

const Config: IConfig = Environment;
export const isDevelopmentMode = (): boolean => {
  return Config.environment === 'acceptance' || Config.environment === 'testing';
};

export default Config;
