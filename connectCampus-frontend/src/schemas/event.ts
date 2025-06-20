import { z } from 'zod';

// Common validation schemas
const titleSchema = z.string().min(1, 'Event title is required').min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters');

const descriptionSchema = z
  .string()
  .min(1, 'Event description is required')
  .min(10, 'Description must be at least 10 characters')
  .max(2000, 'Description must be less than 2000 characters');

const urlSchema = z
  .string()
  .optional()
  .refine(val => !val || z.string().url().safeParse(val).success, {
    message: 'Please enter a valid URL',
  });

const emailSchema = z.string().min(1, 'Contact email is required').email('Please enter a valid email address');

// Event categories
const eventCategories = [
  'Academic',
  'Workshop',
  'Conference',
  'Cultural',
  'Sports',
  'Technology',
  'Arts',
  'Business',
  'Science',
  'Social',
  'Environmental',
  'Healthcare',
  'Career',
  'Competition',
  'Other',
] as const;

// Event types - matching backend EventType enum
const eventTypes = ['Party', 'Conference', 'Training', 'Workshop', 'Seminar', 'Networking', 'Fundraising', 'Competition', 'Cultural', 'Sports', 'Other'] as const;

// Event status - matching backend EventStatus enum
const eventStatuses = ['Draft', 'Published', 'Cancelled', 'Completed'] as const;

// File validation for cover image
const coverImageSchema = z
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

// Create Event Schema - matching backend CreateEventCommand exactly
export const createEventSchema = z
  .object({
    // Basic Information
    title: titleSchema,
    description: descriptionSchema,
    category: z.enum(eventCategories, {
      errorMap: () => ({ message: 'Please select an event category' }),
    }),
    type: z.enum(eventTypes, {
      errorMap: () => ({ message: 'Please select an event type' }),
    }),

    // Date and Time
    startDate: z
      .date({
        required_error: 'Start date is required',
        invalid_type_error: 'Please enter a valid start date',
      })
      .min(new Date(), 'Start date cannot be in the past'),
    endDate: z.date({
      required_error: 'End date is required',
      invalid_type_error: 'Please enter a valid end date',
    }),
    timezone: z.string().min(1, 'Timezone is required'),

    // Location
    location: z.string().min(1, 'Event location is required').max(300, 'Location must be less than 300 characters'),

    // Capacity and Registration
    capacity: z.number().int('Capacity must be a whole number').min(1, 'Capacity must be at least 1').max(10000, 'Capacity cannot exceed 10,000'),
    maxAttendees: z.number().int('Max attendees must be a whole number').min(1, 'Max attendees must be at least 1').optional(),

    // Registration Settings
    isPublic: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    registrationRequired: z.boolean().default(false),
    registrationDeadline: z
      .date({
        invalid_type_error: 'Please enter a valid registration deadline',
      })
      .optional(),
    registrationUrl: urlSchema,

    // Pricing
    isFree: z.boolean().default(true),
    price: z.number().min(0, 'Price cannot be negative').max(10000, 'Price cannot exceed 10,000').optional(),
    paymentMethod: z.string().max(100, 'Payment method must be less than 100 characters').optional(),

    // Contact and Media
    contactEmail: emailSchema,
    coverImage: coverImageSchema,

    // Status
    status: z.enum(eventStatuses).default('Draft'),

    // Tags
    tags: z.array(z.string().min(1).max(50)).max(10, 'You can add up to 10 tags').optional(),
  })
  .refine(data => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .refine(
    data => {
      if (data.registrationDeadline) {
        return data.registrationDeadline <= data.startDate;
      }
      return true;
    },
    {
      message: 'Registration deadline must be before or on the start date',
      path: ['registrationDeadline'],
    },
  )
  .refine(
    data => {
      if (!data.isFree && !data.price) {
        return false;
      }
      return true;
    },
    {
      message: 'Price is required when event is not free',
      path: ['price'],
    },
  )
  .refine(
    data => {
      if (data.maxAttendees && data.maxAttendees > data.capacity) {
        return false;
      }
      return true;
    },
    {
      message: 'Max attendees cannot exceed capacity',
      path: ['maxAttendees'],
    },
  );

// Update Event Schema - build from scratch to allow editing past events
export const updateEventSchema = z
  .object({
    // ID field for updates
    id: z.string().uuid('Invalid event ID'),

    // Basic Information
    title: titleSchema,
    description: descriptionSchema,
    category: z.enum(eventCategories, {
      errorMap: () => ({ message: 'Please select an event category' }),
    }),
    type: z.enum(eventTypes, {
      errorMap: () => ({ message: 'Please select an event type' }),
    }),

    // Date and Time - no past date validation for existing events
    startDate: z.date({
      required_error: 'Start date is required',
      invalid_type_error: 'Please enter a valid start date',
    }),
    endDate: z.date({
      required_error: 'End date is required',
      invalid_type_error: 'Please enter a valid end date',
    }),
    timezone: z.string().min(1, 'Timezone is required'),

    // Location
    location: z.string().min(1, 'Event location is required').max(300, 'Location must be less than 300 characters'),

    // Capacity and Registration
    capacity: z.number().int('Capacity must be a whole number').min(1, 'Capacity must be at least 1').max(10000, 'Capacity cannot exceed 10,000'),
    maxAttendees: z.number().int('Max attendees must be a whole number').min(1, 'Max attendees must be at least 1').optional(),

    // Registration Settings
    isPublic: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    registrationRequired: z.boolean().default(false),
    registrationDeadline: z
      .date({
        invalid_type_error: 'Please enter a valid registration deadline',
      })
      .optional(),
    registrationUrl: urlSchema,

    // Pricing
    isFree: z.boolean().default(true),
    price: z.number().min(0, 'Price cannot be negative').max(10000, 'Price cannot exceed 10,000').optional(),
    paymentMethod: z.string().max(100, 'Payment method must be less than 100 characters').optional(),

    // Contact and Media
    contactEmail: emailSchema,
    coverImage: coverImageSchema,

    // Status
    status: z.enum(eventStatuses).default('Draft'),

    // Tags
    tags: z.array(z.string().min(1).max(50)).max(10, 'You can add up to 10 tags').optional(),
  })
  .refine(data => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .refine(
    data => {
      if (data.registrationDeadline) {
        return data.registrationDeadline <= data.startDate;
      }
      return true;
    },
    {
      message: 'Registration deadline must be before or on the start date',
      path: ['registrationDeadline'],
    },
  )
  .refine(
    data => {
      if (!data.isFree && !data.price) {
        return false;
      }
      return true;
    },
    {
      message: 'Price is required when event is not free',
      path: ['price'],
    },
  )
  .refine(
    data => {
      if (data.maxAttendees && data.maxAttendees > data.capacity) {
        return false;
      }
      return true;
    },
    {
      message: 'Max attendees cannot exceed capacity',
      path: ['maxAttendees'],
    },
  );

// Quick Event Schema for faster event creation
export const quickEventSchema = z.object({
  title: titleSchema,
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  startDate: z.date().min(new Date(), 'Start date cannot be in the past'),
  endDate: z.date(),
  location: z.string().min(1, 'Location is required').max(300, 'Location must be less than 300 characters'),
  category: z.enum(eventCategories),
  isPublic: z.boolean().default(true),
});

// Event Registration Schema
export const eventRegistrationSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  eventId: z.string().uuid('Invalid event ID'),
  additionalInfo: z.string().optional(),
});

// Event Search Schema
export const eventSearchSchema = z.object({
  query: z.string().optional(),
  category: z.enum([...eventCategories, 'All']).optional(),
  type: z.enum([...eventTypes, 'All']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  location: z.string().optional(),
  isFree: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

// Type exports
export type CreateEventFormValues = z.infer<typeof createEventSchema>;
export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;
export type EventRegistrationFormValues = z.infer<typeof eventRegistrationSchema>;
export type EventSearchFormValues = z.infer<typeof eventSearchSchema>;
export type QuickEventFormValues = z.infer<typeof quickEventSchema>;

// Enum exports
export const EventCategories = eventCategories;
export const EventTypes = eventTypes;
