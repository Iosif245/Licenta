import { ZodSchema, ZodError } from 'zod';

/**
 * Utility function to validate form data using Zod schema
 * Returns validation result with errors formatted for React Hook Form
 */
export const validateSchema = <T>(schema: ZodSchema<T>, data: unknown): { success: true; data: T; errors: {} } | { success: false; data: null; errors: Record<string, string> } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result, errors: {} };
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
      });
      return { success: false, data: null, errors: formattedErrors };
    }
    return { success: false, data: null, errors: { general: 'Validation failed' } };
  }
};

/**
 * Utility function to get field-specific error message from Zod validation result
 */
export const getFieldError = (errors: Record<string, string>, fieldName: string): string | undefined => {
  return errors[fieldName];
};

/**
 * Custom Zod refinement for password confirmation
 */
export const passwordMatchRefinement = (data: { password: string; confirmPassword: string }) => {
  return data.password === data.confirmPassword;
};

/**
 * Custom Zod refinement for date range validation
 */
export const dateRangeRefinement = (data: { startDate: Date; endDate: Date }) => {
  return data.endDate > data.startDate;
};

/**
 * Utility to transform Zod errors to React Hook Form format
 */
export const zodErrorToFormErrors = (zodError: ZodError) => {
  const errors: Record<string, { type: string; message: string }> = {};

  zodError.errors.forEach(error => {
    const path = error.path.join('.');
    errors[path] = {
      type: error.code,
      message: error.message,
    };
  });

  return errors;
};

/**
 * Higher-order function to create a resolver for React Hook Form with Zod
 */
export const createZodResolver = <T>(schema: ZodSchema<T>) => {
  return (data: unknown) => {
    try {
      const result = schema.parse(data);
      return { values: result, errors: {} };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          values: {},
          errors: zodErrorToFormErrors(error),
        };
      }
      return {
        values: {},
        errors: { root: { type: 'validation', message: 'Validation failed' } },
      };
    }
  };
};

/**
 * Utility to check if a file is a valid image
 */
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  return validTypes.includes(file.type) && file.size <= maxSize;
};

/**
 * Utility to format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Utility to validate and format phone numbers
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // International phone number regex (basic validation)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

/**
 * Utility to validate URLs
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Common validation messages
 */
export const ValidationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be less than ${max} characters`,
  invalidUrl: 'Please enter a valid URL',
  invalidPhone: 'Please enter a valid phone number',
  passwordMismatch: "Passwords don't match",
  invalidDate: 'Please enter a valid date',
  dateInPast: 'Date cannot be in the past',
  dateInFuture: 'Date cannot be in the future',
  fileSize: 'File size must be less than 5MB',
  fileType: 'Please upload a valid image file (JPEG, PNG, or WebP)',
  numberMin: (min: number) => `Must be at least ${min}`,
  numberMax: (max: number) => `Must be at most ${max}`,
} as const;
