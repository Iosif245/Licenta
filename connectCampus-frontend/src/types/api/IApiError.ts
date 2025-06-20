interface IApiError {
  title: string;
  status: number;
  detail: string;
  errors?: any[];
  extensions?: {
    errors?: Array<{
      propertyName: string;
      errorMessage: string;
      errorCode?: string;
    }>;
    [key: string]: any;
  };
}

export default IApiError;
