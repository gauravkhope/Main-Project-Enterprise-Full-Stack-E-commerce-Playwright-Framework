import { z } from 'zod';

export const UserProfileSchema =
  z.object({
    user: z.object({
      id: z.number(),

      name: z.string(),

      email: z.string(),

      role: z.string(),

      avatar: z.any().nullable(),

      createdAt: z.string(),
    }),
  });