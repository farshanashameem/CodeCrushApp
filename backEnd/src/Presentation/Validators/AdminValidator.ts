import { z } from 'zod';
import { UserAction } from '@/Application/enums/userAction.enum';


export const QuerySchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(1)
});

export const userIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const updateStatusSchema = z.object({
  action: z.nativeEnum(UserAction),
});