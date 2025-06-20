import { z } from 'zod';

// Common validation schemas
const nameSchema = z.string().min(1, 'Association name is required').min(2, 'Must be at least 2 characters').max(100, 'Must be less than 100 characters');

const emailSchema = z.string().min(1, 'Email is required').email('Please enter a valid email address');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
  .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
  .regex(/(?=.*\d)/, 'Password must contain at least one number')
  .regex(/(?=.*[@$!%*?&])/, 'Password must contain at least one special character (@$!%*?&)');

const descriptionSchema = z
  .string()
  .min(1, 'Description is required')
  .min(10, 'Description must be at least 10 characters')
  .max(1000, 'Description must be less than 1000 characters');

const urlSchema = z
  .string()
  .optional()
  .refine(val => !val || z.string().url().safeParse(val).success, {
    message: 'Please enter a valid URL',
  });

const phoneSchema = z
  .string()
  .optional()
  .refine(val => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
    message: 'Please enter a valid phone number',
  });

// Categories for associations
const associationCategories = ['Academic', 'Cultural', 'Sports', 'Technology', 'Arts', 'Business', 'Science', 'Social', 'Environmental', 'Healthcare', 'Other'] as const;

// File validation schemas
const imageFileSchema = z
  .instanceof(File)
  .optional()
  .nullable()
  .refine(file => {
    if (!file) return true;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  }, 'Please upload a valid image file (JPEG, PNG, or WebP)')
  .refine(file => {
    if (!file) return true;
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  }, 'File size must be less than 5MB');

// Association Registration Schema
export const associationRegistrationSchema = z
  .object({
    // Required fields
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    description: descriptionSchema,
    category: z.enum(associationCategories, {
      errorMap: () => ({ message: 'Please select a category' }),
    }),
    foundedYear: z
      .number()
      .int('Founded year must be a whole number')
      .min(1800, 'Founded year must be after 1800')
      .max(new Date().getFullYear(), 'Founded year cannot be in the future'),

    // Optional fields
    website: urlSchema,
    logo: imageFileSchema,
    coverImage: imageFileSchema,
    location: z.string().max(200, 'Location must be less than 200 characters').optional(),
    phone: phoneSchema,
    address: z.string().max(300, 'Address must be less than 300 characters').optional(),

    // Social media links
    facebook: urlSchema,
    twitter: urlSchema,
    instagram: urlSchema,
    linkedIn: urlSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Association Profile Update Schema (without password)
export const associationUpdateSchema = z.object({
  name: nameSchema,
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: descriptionSchema,
  category: z.enum(associationCategories, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  foundedYear: z
    .number()
    .int('Founded year must be a whole number')
    .min(1800, 'Founded year must be after 1800')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future'),

  // Contact information
  email: emailSchema,
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  website: urlSchema,
  phone: phoneSchema,
  address: z.string().max(300, 'Address must be less than 300 characters').optional(),

  // Social media links
  facebook: urlSchema,
  twitter: urlSchema,
  instagram: urlSchema,
  linkedIn: urlSchema,

  // Media
  logo: imageFileSchema,
  coverImage: imageFileSchema,

  // Tags
  tags: z.array(z.string().min(1).max(50)).max(10, 'You can add up to 10 tags').optional(),
});

// Association Basic Info Schema (for partial updates)
export const associationBasicSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  category: z.enum(associationCategories, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  foundedYear: z
    .number()
    .int('Founded year must be a whole number')
    .min(1800, 'Founded year must be after 1800')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future'),
});

// Association Contact Schema
export const associationContactSchema = z.object({
  email: emailSchema,
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  website: urlSchema,
  phone: phoneSchema,
  address: z.string().max(300, 'Address must be less than 300 characters').optional(),
});

// Association Social Links Schema
export const associationSocialSchema = z.object({
  facebook: urlSchema,
  twitter: urlSchema,
  instagram: urlSchema,
  linkedIn: urlSchema,
});

// Association Media Schema
export const associationMediaSchema = z.object({
  logo: imageFileSchema,
  coverImage: imageFileSchema,
});

// Type exports
export type AssociationRegistrationFormValues = z.infer<typeof associationRegistrationSchema>;
export type AssociationUpdateFormValues = z.infer<typeof associationUpdateSchema>;
export type AssociationBasicFormValues = z.infer<typeof associationBasicSchema>;
export type AssociationContactFormValues = z.infer<typeof associationContactSchema>;
export type AssociationSocialFormValues = z.infer<typeof associationSocialSchema>;
export type AssociationMediaFormValues = z.infer<typeof associationMediaSchema>;

// Category enum export
export const AssociationCategories = associationCategories;
