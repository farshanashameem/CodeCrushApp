import { z } from 'zod';
import { UserAction } from '@/Application/enums/userAction.enum';

/* -----------------------------
   Get All Children
------------------------------ */

export const getChildrenQuerySchema = z.object({
  search: z.string().trim().optional(),
});

/* -----------------------------
   Child Id Param
------------------------------ */

export const childIdSchema = z.object({
  childId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: 'Invalid child id',
  }),
});

/* -----------------------------
   Toggle Child Status
------------------------------ */

export const toggleChildStatusSchema = z.object({
  action: z.nativeEnum(UserAction),
});

/* -----------------------------
   Add Child
------------------------------ */

export const addChildSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must contain at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),

  age: z.coerce
    .number()
    .int('Age must be a whole number')
    .min(1, 'Age must be at least 1')
    .max(18, 'Age cannot exceed 18'),

  dob: z.coerce.date().optional(),

  avatar: z
    .string()
    .trim()
    .min(1, 'Avatar is required'),
});

/* -----------------------------
   Update Child
------------------------------ */

export const updateChildSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must contain at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .optional(),

  age: z.coerce
    .number()
    .int('Age must be a whole number')
    .min(1, 'Age must be at least 1')
    .max(18, 'Age cannot exceed 18')
    .optional(),

  dob: z.coerce.date().optional(),

  avatar: z
    .string()
    .trim()
    .min(1, 'Avatar cannot be empty')
    .optional(),
});