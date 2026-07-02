import z from 'zod';

 export const imageIdSchema = z.object({
    imageId: z.string().min(1)
});

export const addImageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Image name must be at least 2 characters')
    .max(50, 'Image name cannot exceed 50 characters'),

  category: z
    .string()
    .trim()
    .optional(),
});

export const updateImageSchema = z.object({

    name: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .optional(),

    imageUrl: z
      .string()
      .trim()
      .url('Invalid image URL')
      .optional(),
    
    publicId: z
      .string()
      .trim()
      .optional(),

    category: z
      .string()
      .trim()
      .optional(),

    isActive: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.imageUrl !== undefined ||
      data.publicId !== undefined ||
      data.category !== undefined ||
      data.isActive !== undefined,
    {
      message: 'At least one field must be provided',
    }
  );