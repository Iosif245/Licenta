import ApiException from '@app/types/api/ApiException';
import IApiError from '@app/types/api/IApiError';

const handleApiError = (err: any): ApiException => {
  const errorData: IApiError = err.response?.data as unknown as IApiError;

  const exception: ApiException = new ApiException(errorData);

  return exception;
};

export default handleApiError;
