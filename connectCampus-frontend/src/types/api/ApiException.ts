import IApiError from './IApiError';
import alertService from '@app/services/alert';

class ApiException extends Error {
  data?: IApiError;
  error: string;
  title: string;

  constructor(data: IApiError) {
    super();
    this.data = data;
    this.populate();
  }

  private populate() {
    if (!this.data?.status) {
      this.title = 'Something went wrong';
      this.error = 'An unexpected error occurred. Please try again.';
      return;
    }

    // Handle validation errors - check if errors is an object with field validation errors
    if (this.data.errors && typeof this.data.errors === 'object') {
      this.title = 'Validation Error';
      const errorMessages: string[] = [];

      // Handle ASP.NET Core model validation format: { "FieldName": ["Error message 1", "Error message 2"] }
      Object.keys(this.data.errors).forEach(fieldName => {
        const fieldErrors = (this.data.errors as any)[fieldName];
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach(errorMsg => {
            errorMessages.push(errorMsg);
          });
        } else if (typeof fieldErrors === 'string') {
          errorMessages.push(fieldErrors);
        }
      });

      if (errorMessages.length > 0) {
        this.error = errorMessages.join('\n');
        return;
      }
    }

    // Handle validation errors from ASP.NET Core ProblemDetails format (extensions.errors)
    const validationErrors = this.data.extensions?.errors;
    if (validationErrors && Array.isArray(validationErrors) && validationErrors.length > 0) {
      this.title = 'Validation Error';
      const errorMessages = validationErrors.map((err: any) => {
        // Handle ASP.NET Core ProblemDetails format
        if (err.errorMessage) {
          return err.errorMessage;
        }
        // Handle direct error format
        if (err.message) {
          return err.message;
        }
        // Fallback
        return err.errorCode || 'Validation failed';
      });
      this.error = errorMessages.join('\n');
      return;
    }

    if (this.data.status === 400) {
      this.title = 'Bad Request';
      this.error = this.data.detail || 'The request was invalid. Please check your input and try again.';
      return;
    }
    if (this.data.status === 403) {
      this.title = 'Access Forbidden';
      this.error = 'You do not have permission to access this resource.';
      return;
    }
    if (this.data.status === 404) {
      this.title = 'Not Found';
      this.error = 'The requested resource could not be found.';
      return;
    }
    if (this.data.status === 503) {
      this.title = 'Service Unavailable';
      this.error = this.data.detail || 'The service is temporarily unavailable. Please try again later.';
      return;
    }

    this.title = 'Error';
    this.error = this.data.detail || 'An error occurred while processing your request.';
  }

  show() {
    alertService.errorAlert({ title: this.title, message: this.error });
  }
}

export default ApiException;
