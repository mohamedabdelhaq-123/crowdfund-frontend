import { z } from 'zod';

const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;

export const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  mobile_number: z.string().regex(egyptianPhoneRegex, 'Invalid Egyptian phone number'),
  birthdate: z.string().optional(),
  fb_profile: z.string().url().optional().or(z.literal('')),
  country: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;