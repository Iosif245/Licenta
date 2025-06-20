// Authentication schemas
export * from './auth';

// User registration and profile schemas
export * from './student';
export * from './association';

// Event schemas
export * from './event';

// Re-export commonly used types for convenience
export type { LoginFormValues, ForgotPasswordFormValues, ResetPasswordFormValues, TwoFactorFormValues } from './auth';

export type { StudentRegistrationFormValues, StudentUpdateFormValues, StudentAcademicFormValues, StudentSocialFormValues } from './student';

export type {
  AssociationRegistrationFormValues,
  AssociationUpdateFormValues,
  AssociationBasicFormValues,
  AssociationContactFormValues,
  AssociationSocialFormValues,
  AssociationMediaFormValues,
} from './association';

export type { CreateEventFormValues, UpdateEventFormValues, EventRegistrationFormValues, EventSearchFormValues, QuickEventFormValues } from './event';
