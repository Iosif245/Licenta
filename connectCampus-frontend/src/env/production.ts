import IConfig from '@app/types/config/IConfig';

const ProductionEnvironment: IConfig = {
  environment: (import.meta as any).env?.VITE_ENVIRONMENT,
  api: {
    apiUrl: (import.meta as any).env?.VITE_API_URL,
  },
};

export default ProductionEnvironment;