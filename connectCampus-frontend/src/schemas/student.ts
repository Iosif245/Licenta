import { z } from 'zod';
import { EducationLevel } from '@app/types/student';

// Common validation schemas
const nameSchema = z
  .string()
  .min(1, 'This field is required')
  .min(2, 'Must be at least 2 characters')
  .max(50, 'Must be less than 50 characters')
  .regex(/^[a-zA-ZăâîșțĂÂÎȘȚ\s]+$/, 'Only letters and spaces are allowed');

const emailSchema = z.string().min(1, 'Email is required').email('Please enter a valid email address');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
  .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
  .regex(/(?=.*\d)/, 'Password must contain at least one number')
  .regex(/(?=.*[@$!%*?&])/, 'Password must contain at least one special character (@$!%*?&)');

const academicFieldSchema = z.string().min(1, 'This field is required').min(2, 'Must be at least 2 characters').max(100, 'Must be less than 100 characters');

const urlSchema = z
  .string()
  .optional()
  .refine(val => !val || z.string().url().safeParse(val).success, {
    message: 'Please enter a valid URL',
  });

// File validation for avatar
const avatarFileSchema = z
  .instanceof(File)
  .refine(file => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  }, 'Please upload a valid image file (JPEG, PNG, or WebP)')
  .refine(file => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  }, 'File size must be less than 5MB');

// Student Registration Schema
export const studentRegistrationSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    university: academicFieldSchema,
    faculty: academicFieldSchema,
    specialization: academicFieldSchema,
    studyYear: z.number().int('Study year must be a whole number').min(1, 'Study year must be at least 1').max(6, 'Study year must be at most 6'),
    educationLevel: z.nativeEnum(EducationLevel, {
      errorMap: () => ({ message: 'Please select an education level' }),
    }),
    avatar: avatarFileSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Student Profile Update Schema (without password and email)
export const studentUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  university: academicFieldSchema,
  faculty: academicFieldSchema,
  specialization: academicFieldSchema,
  studyYear: z.number().int('Study year must be a whole number').min(1, 'Study year must be at least 1').max(6, 'Study year must be at most 6'),
  educationLevel: z.nativeEnum(EducationLevel, {
    errorMap: () => ({ message: 'Please select an education level' }),
  }),
  linkedInUrl: urlSchema,
  gitHubUrl: urlSchema,
  facebookUrl: urlSchema,
  interests: z.array(z.string()).max(10, 'You can select up to 10 interests').optional(),
  avatar: avatarFileSchema,
});

// Student Academic Info Schema (for partial updates)
export const studentAcademicSchema = z.object({
  university: academicFieldSchema,
  faculty: academicFieldSchema,
  specialization: academicFieldSchema,
  studyYear: z.number().int('Study year must be a whole number').min(1, 'Study year must be at least 1').max(6, 'Study year must be at most 6'),
  educationLevel: z.nativeEnum(EducationLevel, {
    errorMap: () => ({ message: 'Please select an education level' }),
  }),
});

// Student Social Links Schema
export const studentSocialSchema = z.object({
  linkedInUrl: urlSchema,
  gitHubUrl: urlSchema,
  facebookUrl: urlSchema,
});

// Type exports
export type StudentRegistrationFormValues = z.infer<typeof studentRegistrationSchema>;
export type StudentUpdateFormValues = z.infer<typeof studentUpdateSchema>;
export type StudentAcademicFormValues = z.infer<typeof studentAcademicSchema>;
export type StudentSocialFormValues = z.infer<typeof studentSocialSchema>;
