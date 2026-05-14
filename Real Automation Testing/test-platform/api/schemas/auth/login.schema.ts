import { z } from 'zod';

export const LoginSchema =
  z.object({
    message: z.string(),

    token: z.string(),

    user: z.object({
      id: z.number(),

      name: z.string(),

      email: z.string(),

      role: z.string(),

      avatar: z.any().nullable(),
    }),
  });

export const InvalidLoginSchema =
  z.object({
    message: z.string(),

    remainingAttempts:
      z.number(),
  });

  export const MissingCredentialsSchema =
  z.object({
    message: z.string(),
  });