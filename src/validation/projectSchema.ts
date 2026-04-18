import { z } from 'zod';

const MAX_IMAGES = 5; // match your validate_max_images validator
const MAX_TAGS = 10;  // match your validate_max_tags validator

export const projectSchema = z.object({
  // Basic fields
  title: z.string().min(1, 'Title is required').max(255),
  details: z.string().min(1, 'Details are required'),
  target: z.number({ invalid_type_error: 'Target must be a number' })
    .positive('Target must be greater than 0'),

  // Dates
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),

  // Relations — user picks from a list, so just an id
  category: z.number({ required_error: 'Category is required' }),

  // Tags — write_only, list of strings
  tags: z.string().optional(),

  // Images — write_only, list of files
  images: z
    .custom<FileList>()
    .refine((files) => !files || files.length <= MAX_IMAGES, `Max ${MAX_IMAGES} images`)
    .optional(),

}).refine(
  (data) => new Date(data.end_date) > new Date(data.start_date),
  {
    message: 'End date must be after start date',
    path: ['end_date'],
  }
);

export type ProjectFormData = z.infer<typeof projectSchema>;