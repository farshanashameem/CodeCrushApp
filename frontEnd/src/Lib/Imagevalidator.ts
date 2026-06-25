import { z } from "zod";

export const imageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Image name must be at least 2 characters")
    .max(50, "Image name cannot exceed 50 characters"),
});

export type ImageFormData = z.infer<typeof imageSchema>;