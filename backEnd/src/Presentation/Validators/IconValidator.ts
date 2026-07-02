import z from 'zod';

 export const iconIdSchema = z.object({
    iconId: z.string().min(1)
});

export const addIconSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Icon name must be at least 2 characters')
    .max(50, 'Icon name cannot exceed 50 characters'),

  iconKey: z
    .string()
    .trim()
    .min(1, 'Icon key is required'),

  color: z
    .string()
    .trim()
    .min(1, 'Color is required'),

  
  category: z
    .string()
    .trim()
    .optional()
});

export const updateIconSchema = z
  .object({
    iconId: z.string().trim().min(1, 'Icon ID is required'),

    name: z.string().trim().min(2).max(50).optional(),

    iconKey: z.string().trim().optional(),
    color: z
    .string()
    .trim()
    .min(1, 'Color is required'),

    category: z.string().trim().optional(),

    isActive: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.iconKey !== undefined ||
      data.category !== undefined ||
      data.isActive !== undefined,
    {
      message: 'At least one field must be provided',
    }
  );